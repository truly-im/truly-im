import path from "path-browserify";
export async function newPlugin(pluginPath: string) {
    const url = new URL(pluginPath);
    const packageJson = await (
        await fetch(new URL(path.join(url.pathname, "package.json"), url))
    ).json();
    return new Function(
        await (
            await fetch(new URL(path.join(url.pathname, packageJson.main), url))
        ).text()
    );
}
