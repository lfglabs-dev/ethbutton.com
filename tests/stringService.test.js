import { formatTime } from "../utils/stringService";

describe("Should test formatTime function", () => {
  test('formats 0 seconds as "00:00:00:00"', () => {
    expect(formatTime(0)).toBe("00:00:00:00");
  });

  test("formats less than a minute correctly", () => {
    expect(formatTime(45)).toBe("00:00:00:45");
    expect(formatTime(9)).toBe("00:00:00:09");
  });

  test("formats exactly one minute correctly", () => {
    expect(formatTime(60)).toBe("00:00:01:00");
  });

  test("formats more than a minute correctly", () => {
    expect(formatTime(125)).toBe("00:00:02:05");
    expect(formatTime(3599)).toBe("00:00:59:59");
  });

  test("formats exactly one hour correctly", () => {
    expect(formatTime(3600)).toBe("00:01:00:00");
  });

  test("formats more than an hour correctly", () => {
    expect(formatTime(3725)).toBe("00:01:02:05");
  });

  test("formats exactly one day correctly", () => {
    expect(formatTime(86400)).toBe("01:00:00:00");
  });

  test("formats more than a day correctly", () => {
    expect(formatTime(90061)).toBe("01:01:01:01");
  });

  test("formats large number of seconds correctly", () => {
    expect(formatTime(3661)).toBe("00:01:01:01");
    expect(formatTime(7322)).toBe("00:02:02:02");
    expect(formatTime(90061)).toBe("01:01:01:01");
    expect(formatTime(172800)).toBe("02:00:00:00");
  });
});
