
# **Markdown v2 Overview**
---

```markdown

## **1. Headers**

**Syntax:**
```markdown
# Header 1
## Header 2
### Header 3
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

**Rendered HTML:**
```html
<a href="https://example.com">Link Text</a>
```

**Images:**
```markdown
![Alt Text](https://example.com/image.jpg)
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
~arg[ArgName]:Type (short description)
~
```
or:
```markdown
~💡[ArgName]:Type (short description)
~
```

**Example:**
```markdown
~arg[UserName]:String (the user’s display name)
~
```

**Referencing Arguments:**
```markdown
{ArgName}
```

**Example:**
```markdown
Hello, {UserName}!
```

---

## **7. AI Components**

**Syntax Options:**
```markdown
~ai[ComponentName](param1: value1, param2: value2)
This defines the AI component.

**History:**  
- User: What is AI?  
- AI: Artificial Intelligence is the simulation of human intelligence processes by machines.
~
```
or:
```markdown
~🤖[ComponentName](param1: value1, param2: value2)
This defines the AI component.

**History:**  
- User: What is AI?  
- AI: Artificial Intelligence is the simulation of human intelligence processes by machines.
~
```

**Example:**
```markdown
~ai[AIModel](name: "text-davinci-003", max_tokens: 100)
This defines the AI model configuration with a maximum token limit.

**History:**  
- User: What is AI?  
- AI: Artificial Intelligence is the simulation of human intelligence processes by machines.
~
```

**Referencing AI Components:**
```markdown
{AIModel}
```

**Example:**
```markdown
The AI component being used is: {AIModel}.
```

---

## **8. Tools**

**Syntax Options:**
```markdown
~tool[ToolName](property1: value1, property2: value2)
**Args:**  
- ArgName: description.  
- ArgName2: another description.

**Description:**  
Brief overview of the tool’s purpose.
~
```
or:
```markdown
~🔧[ToolName](property1: value1, property2: value2)
**Args:**  
- ArgName: description.  
- ArgName2: another description.

**Description:**  
Brief overview of the tool’s purpose.
~
```

**Example:**
```markdown
~tool[Calculator](function: "basic arithmetic", language: "JavaScript")
**Args:**  
- num1: the first number (Number).  
- num2: the second number (Number).  
- operation: the operation to perform (String), e.g., "add", "subtract".

**Description:**  
Performs basic arithmetic operations and returns the result.
~
```

---

## **9. Components (Structured Layouts)**

**Syntax:**
```markdown
> [bg-blue-100]
> Outer component content.
>
> > [text-gray-500]
> > Nested component level 1.
>
> > > [text-sm italic]
> > > Nested component level 2.
```

**Rendered HTML:**
```html
<div class="bg-blue-100">
  <p>Outer component content.</p>
  <div class="text-gray-500">
    <p>Nested component level 1.</p>
    <div class="text-sm italic">
      <p>Nested component level 2.</p>
    </div>
  </div>
</div>
```

---

## **10. Including External Markdown Content**

**Syntax Options:**
```markdown
~mkd(url="URL")
Fallback content (optional).
~
```
or:
```markdown
~📄(url="URL")
Fallback content (optional).
~
```

**Example:**
```markdown
~mkd(url="https://example.com/content.md")
Fallback content goes here.
~
```

---

## **Features Summary with Icon Syntax**

| **Feature**             | **Text-Based Syntax**                          | **Icon-Based Syntax**                                    | **Purpose**                                               |
|--------------------------|-----------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------|
| **Headers & Text**       | `# Header`, `**Bold**`                        | -                                                       | Standard Markdown formatting.                            |
| **Lists & Links**        | `- Item`, `[Link](URL)`                       | -                                                       | Standard list and link formatting.                       |
| **Code Blocks**          | ``````code block``````                         | -                                                       | Displays preformatted code.                              |
| **Define Arguments**     | `~arg[ArgName]:Type (description)`            | `~💡[ArgName]:Type (description)`                       | Defines variables or inputs.                             |
| **Reference Arguments**  | `{ArgName}`                                   | `{ArgName}`                                             | Refers to an argument’s value.                           |
| **Define AI Components** | `~ai[ComponentName](param: value, ...)`       | `~🤖[ComponentName](param: value, ...)`                 | Declares AI models and configurations.                   |
| **Reference Components** | `{AIModel}`                                   | `{AIModel}`                                             | References an AI component’s value or configuration.     |
| **Define Tools**         | `~tool[ToolName](param: value, ...)`          | `~🔧[ToolName](param: value, ...)`                      | Declares tools with properties and arguments.            |
| **Components**           | `> [classes] Content ...`                     | -                                                       | Adds styles to nested structures for reusable components.|
| **External Markdown**    | `~mkd(url="URL") Fallback Content ~`          | `~📄(url="URL") Fallback Content ~`                     | Fetches and renders external Markdown.                   |

