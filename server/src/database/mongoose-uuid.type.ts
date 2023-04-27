import C from "./../constants";
import { Binary } from "mongodb";
import { AnyObject, Schema, Document } from "mongoose";

const UuidRegEx = C.Regex.UUID;

interface WithGetters {
  // eslint-disable-next-line
    getters: Array<Function>;
  // eslint-disable-next-line
    $conditionalHandlers: Array<Function>;
}

const uuidStringToBuffer = (str: string) => Buffer.from(str.replace(/-/g, ""), "hex");

/**
 * @class UUID
 * @extends Binary
 */
export class UUID extends Binary {
  /**
   * @constructor
   * @param {Binary | string | Buffer} binary
   */
  constructor(binary: Binary | string | Buffer) {
    if (typeof binary === "string") {
      if (!UuidRegEx.test(binary)) {
        throw new Error(`${binary} is not a valid UUID string`);
      }
      super(uuidStringToBuffer(binary), Binary.SUBTYPE_UUID);
    } else if (Buffer.isBuffer(binary)) {
      if (binary.length !== 16) {
        throw new Error("UUID buffer must be exactly 16 bytes long");
      }
      super(binary, Binary.SUBTYPE_UUID);
    } else {
      super(binary.buffer, Binary.SUBTYPE_UUID);
    }
  }

  /**
   * @name toUUIDString
   * @returns
   */
  public toUUIDString() {
    return this.toUUID().toString();
  }
}

/**
 * @class MongooseUuid
 * @extends Buffer
 * @implements WithGetters
 */
export class MongooseUuid extends Schema.Types.Buffer implements WithGetters {
  // eslint-disable-next-line
    getters!: Array<Function>;
  // eslint-disable-next-line
    $conditionalHandlers!: Array<Function>;
  static schemaName = "UUID" as any;

  constructor(path: string, options: AnyObject = {}, instance?: string) {
    super(path, options, instance);
    options.subtype = Binary.SUBTYPE_UUID;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  cast(val: any, doc: Document, init: boolean, prev?: any, options?: any): any {
    if (typeof val === "string" && UuidRegEx.test(val)) {
      return new UUID(val);
    }

    if (val instanceof Binary || val?.constructor.name === "Binary") {
      return new UUID(val);
    }

    throw new Error("Could not cast " + val + " to UUID.");
  }

  checkRequired(value: any) {
    return value instanceof Binary && value.sub_type === Binary.SUBTYPE_UUID && value.length() > 0;
  }

  castForQuery($conditional: any, val: any) {
    let handler;

    if (arguments.length === 2) {
      handler = this.$conditionalHandlers[$conditional];

      if (!handler) {
        throw new Error("Can't use " + $conditional + " with UUID.");
      }

      return handler.call(this, val);
    }

    return this.cast($conditional, <any>null, false);
  }
}

// Don't forget to add `Int8` to the type registry
(Schema.Types as any).UUID = MongooseUuid;
