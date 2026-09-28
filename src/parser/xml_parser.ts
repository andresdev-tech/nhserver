import { bad_request_error } from "../http/errors.ts";

interface XmlNode {
    tag: string;
    attributes: Record<string, string>;
    children: XmlNode[];
    text: string;
}

export function parse_xml<T = unknown>(raw: string): T {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
        return null as T;
    }

    // Strip comments, declarations, and doctypes
    const cleaned = trimmed
        .replace(/<!--[\s\S]*?-->/g, "")
        .replace(/<\?xml[\s\S]*?\?>/gi, "")
        .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
        .trim();

    if (cleaned.length === 0) {
        return null as T;
    }

    const tag_regex = /<(\/)?([a-zA-Z0-9_\-:]+)((?:\s+[^=>\s]+(?:=(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/)?>|([^<]+)/g;
    const stack: XmlNode[] = [];
    const root_nodes: XmlNode[] = [];

    let match: RegExpExecArray | null;

    while ((match = tag_regex.exec(cleaned)) !== null) {
        const [
            ,
            is_closing,
            tag_name,
            raw_attributes,
            is_self_closing,
            text_content,
        ] = match;

        if (text_content !== undefined) {
            const text = text_content.trim();
            if (text.length > 0 && stack.length > 0) {
                const current = stack[stack.length - 1];
                current.text = (current.text ? current.text + " " : "") + text;
            }
            continue;
        }

        if (is_closing) {
            if (stack.length === 0) {
                throw new bad_request_error("Invalid XML payload: unexpected closing tag.");
            }

            const top = stack.pop()!;
            if (top.tag !== tag_name) {
                throw new bad_request_error(
                    `Invalid XML payload: mismatched closing tag </${tag_name}>, expected </${top.tag}>.`,
                );
            }
            continue;
        }

        // Parse attributes
        const attributes: Record<string, string> = {};
        if (raw_attributes) {
            const attr_regex = /([a-zA-Z0-9_\-:]+)(?:=(?:"([^"]*)"|'([^']*)'|([^>\s]+)))?/g;
            let attr_match: RegExpExecArray | null;
            while ((attr_match = attr_regex.exec(raw_attributes)) !== null) {
                const attr_key = attr_match[1];
                const attr_val =
                    attr_match[2] ??
                    attr_match[3] ??
                    attr_match[4] ??
                    "";
                attributes[attr_key] = attr_val;
            }
        }

        const node: XmlNode = {
            tag: tag_name,
            attributes,
            children: [],
            text: "",
        };

        if (stack.length > 0) {
            stack[stack.length - 1].children.push(node);
        } else {
            root_nodes.push(node);
        }

        if (!is_self_closing) {
            stack.push(node);
        }
    }

    if (stack.length > 0) {
        throw new bad_request_error("Invalid XML payload: unclosed tags.");
    }

    if (root_nodes.length === 0) {
        throw new bad_request_error("Invalid XML payload: no valid elements found.");
    }

    function node_to_object(node: XmlNode): unknown {
        const has_attributes = Object.keys(node.attributes).length > 0;
        const has_children = node.children.length > 0;

        if (!has_attributes && !has_children) {
            return node.text;
        }

        const result: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(node.attributes)) {
            result[`@${key}`] = value;
        }

        if (has_children) {
            for (const child of node.children) {
                const child_value = node_to_object(child);

                if (result[child.tag] !== undefined) {
                    if (Array.isArray(result[child.tag])) {
                        (result[child.tag] as unknown[]).push(child_value);
                    } else {
                        result[child.tag] = [result[child.tag], child_value];
                    }
                } else {
                    result[child.tag] = child_value;
                }
            }
        }

        if (node.text && has_children) {
            result["#text"] = node.text;
        } else if (node.text && has_attributes && !has_children) {
            result["#text"] = node.text;
        }

        return result;
    }

    if (root_nodes.length === 1) {
        const root = root_nodes[0];
        return {
            [root.tag]: node_to_object(root),
        } as T;
    }

    const multi_root: Record<string, unknown> = {};
    for (const root of root_nodes) {
        multi_root[root.tag] = node_to_object(root);
    }
    return multi_root as T;
}
