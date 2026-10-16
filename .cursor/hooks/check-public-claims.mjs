#!/usr/bin/env node

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    const event = JSON.parse(input);
    const strings = [];
    const collect = (value) => {
      if (typeof value === "string") strings.push(value);
      else if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
    };
    collect(event);

    const publicCopyPath = /(?:^|[/\\])(?:src[/\\](?:data[/\\](?:lorapok|ecosystem-stats)\.ts|pages[/\\]|components[/\\](?:home|layout)[/\\])|src[/\\]App\.tsx|README\.md|index\.html)(?:$|[/\\])/i;
    if (strings.some((value) => publicCopyPath.test(value))) {
      process.stdout.write(JSON.stringify({
        additional_context: "This edit may affect public Labs copy. Before finishing, verify product ownership, status, license, metrics, performance, privacy, and compatibility claims against the current product repository or a dated official source. The portal catalog is a discovery list, not a verified product count. Keep unresolved claims marked rather than guessing."
      }));
      return;
    }
    process.stdout.write("{}");
  } catch {
    process.stdout.write("{}");
  }
});
