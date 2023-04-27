export default function () {
  return function <T extends { new (...args: any[]): any }>(target: T): T {
    return class extends target {
      properties = Object.getOwnPropertyNames(target.prototype).filter(
        (mN: string) => mN !== "constructor",
      );

      constructor(...arg: any[]) {
        super(...arg);

        this.properties.forEach((member: string) => {
          if (typeof this[member] === "function") {
            this[member] = this[member].bind(this);
            const originalMethod = this[member];

            Object.defineProperty(this, member, {
              value: async function (...props: any[]) {
                const next = props[2];
                if (typeof next !== "function") {
                  return await originalMethod.apply(this, props);
                }

                try {
                  return await originalMethod.apply(this, props);
                } catch (err: any) {
                  next(err);
                }
              },
            });
          }
        });
      }
    };
  };
}
