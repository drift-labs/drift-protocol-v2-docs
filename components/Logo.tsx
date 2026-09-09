export function Logo() {
  return (
    <>
      <img
        src="/assets/velocity.svg"
        width="26"
        height="26"
        alt="Velocity"
        className="md:hidden"
      />
      <span className="hidden md:block">
        <img
          src="/assets/velocity-text-light.svg"
          width="141"
          height="32"
          alt="Velocity"
          className="h-[26px] w-auto dark:hidden"
        />
        <img
          src="/assets/velocity-text-dark.svg"
          width="141"
          height="32"
          alt=""
          className="hidden h-[26px] w-auto dark:block"
        />
      </span>
    </>
  );
}
