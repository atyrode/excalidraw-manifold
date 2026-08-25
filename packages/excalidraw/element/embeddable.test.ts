import { embeddableURLValidator } from "./embeddable";

describe("embeddableURLValidator", () => {
  it("accepts arbitrary HTTP and HTTPS URLs by default", () => {
    expect(
      embeddableURLValidator(
        "https://vm.manifold.tyrode.dev/vnc.html",
        undefined,
      ),
    ).toBe(true);
    expect(
      embeddableURLValidator("http://127.0.0.1:6080/vnc.html", undefined),
    ).toBe(true);
  });

  it("rejects malformed and non-web URLs by default", () => {
    expect(embeddableURLValidator("not a URL", undefined)).toBe(false);
    expect(embeddableURLValidator("javascript:alert(1)", undefined)).toBe(
      false,
    );
    expect(embeddableURLValidator("data:text/html,hello", undefined)).toBe(
      false,
    );
  });

  it("preserves host application validation overrides", () => {
    expect(embeddableURLValidator("https://example.com", false)).toBe(false);
    expect(
      embeddableURLValidator("https://allowed.example/path", [
        "allowed.example",
      ]),
    ).toBe(true);
    expect(
      embeddableURLValidator("https://blocked.example/path", [
        "allowed.example",
      ]),
    ).toBe(false);
  });
});
