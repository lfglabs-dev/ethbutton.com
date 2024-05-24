import { formatTime } from "../utils/stringService";

describe("Should test formatTime function", () => {
  test('formats 0 seconds as "00:00"', () => {
    expect(formatTime(0)).toBe("00:00");
  });

  test("formats less than a minute correctly", () => {
    expect(formatTime(45)).toBe("00:45");
    expect(formatTime(9)).toBe("00:09");
  });

  test("formats exactly one minute correctly", () => {
    expect(formatTime(60)).toBe("01:00");
  });

  test("formats more than a minute correctly", () => {
    expect(formatTime(125)).toBe("02:05");
    expect(formatTime(3599)).toBe("59:59");
  });

  test("formats exactly one hour correctly", () => {
    expect(formatTime(3600)).toBe("60:00");
  });

  test("formats more than an hour correctly", () => {
    expect(formatTime(3725)).toBe("62:05");
  });

  test("formats large number of seconds correctly", () => {
    expect(formatTime(3661)).toBe("61:01");
    expect(formatTime(7322)).toBe("122:02");
  });
});
