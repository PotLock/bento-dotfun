Below is the complete **Markdown v2 Overview**, now updated to include the emoji-based syntax for `~mkd`:

---

# **Markdown v2 Overview**

---

## **1. Headers**

**Syntax:**
```markdown
# Header 1
## Header 2
### Header 3
```

**Icon-Based Syntax:**
```markdown
~✏️ Header 1  
~✏️✏️ Header 2  
~✏️✏️✏️ Header 3
```

**Rendered HTML:**
```html
<h1>Header 1</h1>
<h2>Header 2</h2>
<h3>Header 3</h3>
```

---

## **2. Text Formatting**

**Syntax:**
```markdown
**Bold Text**  
*Italic Text*  
~~Strikethrough~~
```

**Icon-Based Syntax:**
```markdown
~🌟 Bold Text  
~🖋️ Italic Text  
~❌ Strikethrough
```

**Rendered HTML:**
```html
<p><strong>Bold Text</strong></p>
<p><em>Italic Text</em></p>
<p><del>Strikethrough</del></p>
```

---

## **3. Lists**

**Unordered List:**
```markdown
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3
```

**Rendered HTML:**
```html
<ul>
  <li>Item 1</li>
  <li>Item 2
    <ul>
      <li>Subitem 2.1</li>
      <li>Subitem 2.2</li>
    </ul>
  </li>
  <li>Item 3</li>
</ul>
```

**Ordered List:**
```markdown
1. First
2. Second
3. Third
```

**Rendered HTML:**
```html
<ol>
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ol>
```

---

## **4. Links and Images**

**Links:**
```markdown
[Link Text](https://example.com)
```

**Icon-Based Syntax:**
```markdown
~🔗 [Link Text](https://example.com)
```

**Rendered HTML:**
```html
<a href="https://example.com">Link Text</a>
```

**Images:**
```markdown
![Alt Text](https://example.com/image.jpg)
```

**Icon-Based Syntax:**
```markdown
~🖼️ [Alt Text](https://example.com/image.jpg)
```

**Rendered HTML:**
```html
<img src="https://example.com/image.jpg" alt="Alt Text">
```

---

## **5. Code Blocks**

**Inline Code:**
```markdown
`inline code`
```

**Rendered HTML:**
```html
<code>inline code</code>
```

**Fenced Code Blocks:**
```markdown
```
Code content here
```
```

**Rendered HTML:**
```html
<pre><code>Code content here</code></pre>
```

---

## **6. Arguments**

**Syntax Options:**
```markdown
@arg[ArgName]:Type (short description)
```

**Icon-Based Syntax:**
```markdown
@💡 [ArgName]:Type (short description)
```

**Example:**
```markdown
@arg[UserName]:String (the user’s display name)
```

**Referencing Arguments:**
```markdown
{ArgName}
```

**Example:**
```markdown
Hello, {ArgName}!
```

---

## **7. Tools**

**Syntax Options:**
```markdown
@tool[ToolName](property1: value1, property2: value2)
**Args:**  
- ArgName: description.  
- ArgName2: another description.

**Description:**  
Brief overview of the tool’s purpose.
```

**Icon-Based Syntax:**
```markdown
@🔧 [ToolName](property1: value1, property2: value2)
**Args:**  
- ArgName: description.  
- ArgName2: another description.

**Description:**  
Brief overview of the tool’s purpose.
```

**Example:**
```markdown
@tool[Summarizer](text: "Long input text")
**Description:**  
A tool that generates a concise summary from input text.
```

---

## **8. AI Components**

**Syntax Options:**
```markdown
@ai[TextAnalysis](model: "ChatGPT", tool: [Summarizer])
**Description:**  
An AI component that analyzes text and provides additional insights.
```

**Icon-Based Syntax:**
```markdown
@🤖 [BotName](model: "ChatGPT", tool: [Summarizer])
**Description:**  
An AI component that analyzes text and provides additional insights.
```

**Referencing AI Components:**
```markdown
@ai[BotName](prompt)
```

**Example:**
```markdown
The AI component being used is: @ai[BotName](prompt).
```

---

## **9. Components (Structured Layouts)**

**Syntax:**
```markdown
> [lv1]
> Level 1 content.
  > [lv2]
  > Level 2 content.
    > [lv3]
    > This is the third level of content, providing detailed information or advanced explanations.
```

**Icon-Based Syntax:**
```markdown
~📦 [lv1]
Level 1 content.
  ~📦 [lv2]
  Level 2 content.
    ~📦 [lv3]
    This is the third level of content, providing detailed information or advanced explanations.
```

**Rendered HTML:**
```html
<div class="lv1">
  <p>Level 1 content.</p>
  <div class="lv2">
    <p>Level 2 content.</p>
    <div class="lv3">
      <p>This is the third level of content, providing detailed information or advanced explanations.</p>
    </div>
  </div>
</div>
```

---

## **10. Including External Markdown Content**

**Text-Based Syntax:**
```markdown
~mkd(url="URL")
```

**Emoji-Based Syntax:**
```markdown
~📄(url="URL")
```

**Example (Emoji-Based):**
```markdown
~📄(url="https://example.com/content.md")
```

---

## **11. Generate AI Content**

**Shortcut Syntax:**
```markdown
~ai[BotName](prompt)
```

**Icon-Based Syntax:**
```markdown
~🤖 [BotName](prompt)
```

**Example:**
```markdown
~ai[BotName]("Tell me a joke.")
```

**Rendered Output:**
> Sure! Here's a joke:  
> Why don’t scientists trust atoms? Because they make up everything!

---

## **12. Generate AI Images**

**Shortcut Syntax:**
```markdown
~ai-img[BotName](prompt)
```

**Icon-Based Syntax:**
```markdown
~🤖🖼️ [BotName](prompt)
```

**Example:**
```markdown
~ai-img[BotName]("A beautiful sunset over the ocean.")
```

---

## **13. Generate AI Voice**

**Shortcut Syntax:**
```markdown
~ai-voice[BotName](prompt)
```

**Icon-Based Syntax:**
```markdown
~🤖🔈 [BotName](prompt)
```

**Example:**
```markdown
~ai-voice[BotName]("Hello! How can I assist you?")
```

---

## **14. Generate AI Videos**

**Shortcut Syntax:**
```markdown
~ai-video[BotName](prompt)
```

**Icon-Based Syntax:**
```markdown
~🤖🎬 [BotName](prompt)
```

**Example:**
```markdown
~ai-video[BotName]("An animation of the solar system in motion.")
```

---

## **15. Features Summary**

| **Feature**             | **Text-Based Syntax**              | **Icon-Based Syntax**              | **Purpose**                                        |
|--------------------------|-------------------------------------|-------------------------------------|----------------------------------------------------|
| **Headers & Text**       | `# Header`, `**Bold**`             | `~✏️ Header`, `~🌟 Bold`             | Standard Markdown formatting.                     |
| **Italic**               | `*Italic Text*`                   | `~🖋️ Italic Text`                   | Formats text as italic.                           |
| **Lists**                | `- Item`                         | -                                   | Standard list formatting.                         |
| **Links**                | `[Link Text](URL)`               | `~🔗 [Link Text](URL)`               | Adds hyperlinks to your content.                 |
| **Images**               | `![Alt Text](URL)`               | `~🖼️ [Alt Text](URL)`               | Embeds an image with alternative text.           |
| **Code Blocks**          | ``````code block``````             | `~💻 code block`                     | Displays preformatted code.                      |
| **Define Arguments**     | `@arg[ArgName]:Type (description)` | `@💡 [ArgName]:Type (description)`  | Defines variables or inputs.                     |
| **Reference Arguments**  | `{ArgName}`                       | `{ArgName}`                         | Refers to an argument’s value.                   |
| **Define Tools**         | `@tool[ToolName](param: value, ...)` | `@🔧 [ToolName](param: value, ...)` | Declares tools with properties and arguments.    |
| **Define AI Components** | `@ai[BotName](param: value, ...)` | `@🤖 [BotName](param: value, ...)` | Declares AI models and configurations.           |
| **Generate AI Content**  | `~ai[BotName](prompt)`           | `~🤖 [BotName](prompt)`             | Generates content based on the specified prompt. |
| **Generate AI Image**    | `~ai-img[BotName](prompt)`       | `~🤖🖼️ [BotName](prompt)`           | Generates an image based on the specified prompt.|
| **Generate AI Voice**    | `~ai-voice[BotName](prompt)`     | `~🤖🔈[BotName](prompt)`           | Generates voice audio based on the specified prompt.|
| **Generate AI Video**    | `~ai-video[BotName](prompt)`     | `~🤖🎬 [BotName](prompt)`           | Generates a video based on the specified prompt. |
| **Include Markdown**     | `~mkd(url="URL")`                | `~📄(url="URL")`                    | Fetches and renders external Markdown.           |

---

This complete overview now incorporates the emoji-based syntax and example for `~mkd`.
