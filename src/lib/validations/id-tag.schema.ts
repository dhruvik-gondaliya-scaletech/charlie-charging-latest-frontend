import * as z from "zod";
import { IdTagStatus, TokenType } from "@/types";

export function validateIdTag(type: TokenType | string, value: string): { isValid: boolean; message: string } {
  if (!value || typeof value !== 'string') {
    return { isValid: false, message: 'ID Tag is required' };
  }

  const val = value.trim();

  switch (type) {
    case TokenType.RFID:
    case 'RFID (ISO14443)':
      if (!/^[0-9A-F]{8,32}$/i.test(val)) {
        return {
          isValid: false,
          message: 'Invalid RFID (ISO14443) format. Must be 8 to 32 hexadecimal characters (e.g. 04A224B35C6A80)',
        };
      }
      break;

    case TokenType.VICINITY:
    case 'Vicinity (ISO15693)':
      if (!/^[0-9A-F]{16}$/i.test(val)) {
        return {
          isValid: false,
          message: 'Invalid Vicinity (ISO15693) format. Must be 16 hexadecimal characters (e.g. E00401507A91B2C3)',
        };
      }
      break;

    case TokenType.PLUG_AND_CHARGE:
    case 'Plug & Charge (eMAID)':
      if (!/^[A-Z]{2}[A-Z0-9]{1,3}[A-Z0-9]{6,20}$/i.test(val)) {
        return {
          isValid: false,
          message: 'Invalid eMAID format. Must start with 2 country letters + provider code + contract ID (e.g. DE8CSE123456789X)',
        };
      }
      break;

    case TokenType.AUTO_CHARGE:
    case 'AutoCharge (MAC)':
      if (!/^([0-9A-F]{2}([-:]?)){5}[0-9A-F]{2}$/i.test(val)) {
        return {
          isValid: false,
          message: 'Invalid AutoCharge (MAC) format. Must be a valid MAC address (e.g. A4:C1:38:12:34:56 or A4C138123456)',
        };
      }
      break;

    case TokenType.CUSTOM:
    case 'Custom (OCPP 1.6)':
      if (!/^[A-Za-z0-9_-]{1,20}$/.test(val)) {
        return {
          isValid: false,
          message: 'Invalid Custom token format. Must be 1 to 20 alphanumeric characters (e.g. TAG123456)',
        };
      }
      break;

    default:
      if (val.length === 0 || val.length > 36) {
        return {
          isValid: false,
          message: 'ID Tag must be between 1 and 36 characters',
        };
      }
  }

  return { isValid: true, message: '' };
}

export const idTagSchema = z
  .object({
    idTag: z.string().min(1, "ID Tag is required"),
    status: z.nativeEnum(IdTagStatus),
    idTagType: z.nativeEnum(TokenType, {
      message: "Token type is required",
    }),
    driverId: z.string().optional().nullable(),
    stationId: z.string().optional().nullable(),
    locationIds: z.array(z.string()).min(1, "At least one location must be selected"),
    companyName: z.string().optional().nullable(),
    expiryDate: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const result = validateIdTag(data.idTagType, data.idTag);
    if (!result.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
        path: ["idTag"],
      });
    }
  });

export type IdTagFormValues = z.infer<typeof idTagSchema>;
