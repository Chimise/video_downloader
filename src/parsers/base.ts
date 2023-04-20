import { parse, HTMLElement } from "node-html-parser";

/**
 * A Parser is a class that takes in a html string and extracts important metadata from it
 * Other parsers should implement this base parser
 */


class HTMLParser {
    html: string;
    root: HTMLElement;

    constructor(html: string) {
        this.html = html;
        this.root = parse(html, {
            lowerCaseTagName: false,
            comment: false,
            blockTextElements: {
                script: true,
                noscript: false,
                style: false,
                pre: false,
            },
        });
    }

    getPageTitle() {
        const title = this.root.querySelector("title");
        if (!title) {
            return null;
        }

        return this.unescape(title.textContent);
    }

    getMetaContent(value: string) {
        const meta =
            this.root.querySelector(this.genAttrSel("meta", "name", value)) ||
            this.root.querySelector(this.genAttrSel("meta", "property", value)) ||
            this.root.querySelector(this.genAttrSel("meta", "id", value)) ||
            this.root.querySelector(this.genAttrSel("meta", "http-equiv", value));
        if (!meta) {
            return null;
        }
        const content = meta.getAttribute("content");
        if (!content) {
            return null;
        }

        return this.unescape(content);
    }

    getMetaOgContent(value: string) {
        const val1 = `og:${value}`;
        const val2 = `og-${value}`;
        const elem =
            this.root.querySelector(this.genAttrSel("meta", "property", val1)) ||
            this.root.querySelector(this.genAttrSel("meta", "property", val2)) ||
            this.root.querySelector(this.genAttrSel("meta", "name", val1)) ||
            this.root.querySelector(this.genAttrSel("meta", "name", val2));
        if (!elem) {
            return null;
        }

        const content = elem.getAttribute("content");
        if (!content) {
            return null;
        }

        return this.unescape(content);
    }

    getOgThumbnail() {
        return this.getMetaOgContent("image");
    }

    getOgDescription() {
        return this.getMetaOgContent("description");
    }

    getOgTitle() {
        return this.getMetaOgContent("title");
    }

    getOgVideoUrl(secure: boolean = false) {
        const url =
            this.getMetaOgContent("video") || this.getMetaOgContent("video:url");
        if (secure) {
            return this.getMetaOgContent("video:secure_url") || url;
        }

        return url;
    }

    getOgUrl() {
        return this.getMetaOgContent("url");
    }

    getJsonLD<T extends object = {}>() {
        const elem = this.root.querySelector(
            this.genAttrSel("script", "type", "application/ld+json")
        );
        if (!elem) {
            return null;
        }

        const jsonld = elem.textContent.trim();
        try {
            const data: object = JSON.parse(jsonld);
            return data as T;
        } catch (error) {
            return null;
        }
    }

    genAttrSel(
        element: keyof JSX.IntrinsicElements,
        attr: string,
        value: string
    ) {
        return `${element}[${attr}="${value}"]`;
    }

    unescape(htmlStr: string) {
        return htmlStr.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&qout;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    }

    escape(unsafe: string) {
        const escapedStr = unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/&>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        return escapedStr;
    }
}

export default HTMLParser;
