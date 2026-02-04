import argparse
import json
import os
import re
from pathlib import Path
from griffe import GriffeLoader, load

ARG_RE = re.compile(r"^\s{4}(\w+)\s*\(([^)]*)\)\s*:\s*(.*)\s*$")
RET_RE = re.compile(r"^\s{4}([^:]+)\s*:\s*(.*)\s*$")

def parse_google_doc(doc: str | None):
    if not doc:
        return {"summary": None, "params": [], "returns": None}

    lines = doc.strip("\n").splitlines()
    summary = lines[0].strip() if lines else None

    params = []
    returns = None

    section = None
    for line in lines[1:]:
        s = line.rstrip()

        if s.strip() == "Args:":
            section = "args"
            continue
        if s.strip() == "Returns:":
            section = "returns"
            continue
        if not s.strip():
            continue

        if section == "args":
            m = ARG_RE.match(s)
            if m:
                name, typ, desc = m.group(1), m.group(2).strip(), m.group(3).strip()
                params.append({"name": name, "type": typ, "description": desc})
            # else: ignore continuation lines for now (can be added later)
        elif section == "returns":
            m = RET_RE.match(s)
            if m:
                returns = {"type": m.group(1).strip(), "description": m.group(2).strip()}

    return {"summary": summary, "params": params, "returns": returns}

def resolve_fqn(fqn: str, loader: GriffeLoader, root_module, search_paths):
    # fqn like: driftpy.drift_client.DriftClient.deposit
    parts = fqn.split(".")
    for search_path in search_paths:
        base = Path(search_path)
        # Try to resolve by module file path first (works without package imports).
        for i in range(len(parts), 0, -1):
            module_parts = parts[:i]
            remainder = parts[i:]
            module_path_py = base.joinpath(*module_parts).with_suffix(".py")
            module_path_init = base.joinpath(*module_parts, "__init__.py")
            module_path = None
            if module_path_py.exists():
                module_path = module_path_py
            elif module_path_init.exists():
                module_path = module_path_init
            if module_path:
                try:
                    module_name = ".".join(module_parts)
                    parent = root_module if module_parts[0] == root_module.name else None
                    mod = loader._load_module_path(
                        module_name, module_path, parent=parent
                    )
                    obj = mod
                    for p in remainder:
                        obj = obj[p] if hasattr(obj, "__getitem__") else obj.members[p]
                    return obj
                except Exception:
                    continue
        # Fallback to module name resolution.
        for i in range(len(parts), 0, -1):
            modname = ".".join(parts[:i])
            try:
                mod = loader.load(modname)
                obj = mod
                for p in parts[i:]:
                    obj = obj[p] if hasattr(obj, "__getitem__") else obj.members[p]
                return obj
            except Exception:
                continue
    raise ValueError(f"Could not resolve {fqn}")

def extract_symbol(fqn: str, loader: GriffeLoader, root_module, search_paths):
    obj = resolve_fqn(fqn, loader, root_module, search_paths)
    doc = obj.docstring.value if getattr(obj, "docstring", None) else None
    parsed = parse_google_doc(doc)
    signature = None
    if callable(getattr(obj, "signature", None)):
        signature = obj.signature()
    return {
        "fqn": fqn,
        "kind": getattr(getattr(obj, "kind", None), "value", None),
        "signature": str(signature) if signature else None,
        "summary": parsed["summary"],
        "params": parsed["params"],
        "returns": parsed["returns"],
    }


def default_search_paths():
    repo_root = Path(__file__).resolve().parent.parent
    candidate = repo_root / "driftpy" / "src"
    if candidate.exists():
        return [str(candidate)]
    return ["src"]


DEFAULT_FQNS = [
    "driftpy.math.conversion.convert_to_number",
    "driftpy.constants.numeric_constants.PRICE_PRECISION",
    "driftpy.keypair.load_keypair",
    "driftpy.drift_client.DriftClient",
    "driftpy.drift_client.DriftClient.subscribe",
    "driftpy.accounts.ws.drift_client.WebsocketDriftClientAccountSubscriber.fetch",
    "driftpy.drift_client.DriftClient.unsubscribe",
    "driftpy.accounts.bulk_account_loader.BulkAccountLoader",
    "driftpy.drift_client.DriftClient.get_user",
    "driftpy.drift_client.DriftClient.add_user",
    "driftpy.constants.config.DRIFT_PROGRAM_ID",
    "driftpy.addresses.get_high_leverage_mode_config_public_key",
    "driftpy.constants.config.configs",
    "driftpy.constants.config.Config",
]


def read_fqns_from_file(path):
    with open(path, "r", encoding="utf-8") as file:
        lines = [line.strip() for line in file.readlines()]
    return [line for line in lines if line and not line.startswith("#")]


def main():
    parser = argparse.ArgumentParser(
        description="Generate DriftPy API JSON from docstrings."
    )
    parser.add_argument(
        "--fqn",
        action="append",
        default=[],
        help="Fully qualified name (repeatable).",
    )
    parser.add_argument(
        "--input",
        help="Text file with one FQN per line.",
    )
    parser.add_argument(
        "--out",
        default="public/sdk/python/api.json",
        help="Output JSON path.",
    )
    parser.add_argument(
        "--search-path",
        action="append",
        default=[],
        help="Search path for griffe (repeatable).",
    )
    parser.add_argument(
        "--pretty",
        action="store_true",
        help="Pretty-print JSON output.",
    )
    args = parser.parse_args()

    fqns = list(args.fqn)
    if args.input:
        fqns.extend(read_fqns_from_file(args.input))
    if not fqns:
        fqns = list(DEFAULT_FQNS)

    search_paths = args.search_path or default_search_paths()
    loader = GriffeLoader(search_paths=search_paths)
    root_module = loader.load("driftpy")

    output = {"version": 1, "symbols": {}}
    for fqn in fqns:
        output["symbols"][fqn] = extract_symbol(
            fqn, loader, root_module, search_paths
        )

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    indent = 2 if args.pretty else None
    with open(out_path, "w", encoding="utf-8") as file:
        json.dump(output, file, indent=indent)
        if indent:
            file.write(os.linesep)


if __name__ == "__main__":
    main()