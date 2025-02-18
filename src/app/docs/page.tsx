'use client';

export default function DocsPage() {
  return (
    <>

      <h1>Markdown v2 Overview</h1>

      <h2>1. Headers</h2>
      <pre><code># Header 1
        ## Header 2
        ### Header 3</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;h1&gt;Header 1&lt;/h1&gt;
        &lt;h2&gt;Header 2&lt;/h2&gt;
        &lt;h3&gt;Header 3&lt;/h3&gt;</code></pre>

      <h2>2. Text Formatting</h2>
      <pre><code>**Bold Text**
        *Italic Text*
        ~~Strikethrough~~</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;p&gt;&lt;strong&gt;Bold Text&lt;/strong&gt;&lt;/p&gt;
        &lt;p&gt;&lt;em&gt;Italic Text&lt;/em&gt;&lt;/p&gt;
        &lt;p&gt;&lt;del&gt;Strikethrough&lt;/del&gt;&lt;/p&gt;</code></pre>

      <h2>3. Lists</h2>
      <h3>Unordered List:</h3>
      <pre><code>- Item 1
        - Item 2
        - Subitem 2.1
        - Subitem 2.2
        - Item 3</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;ul&gt;
        &lt;li&gt;Item 1&lt;/li&gt;
        &lt;li&gt;Item 2
        &lt;ul&gt;
        &lt;li&gt;Subitem 2.1&lt;/li&gt;
        &lt;li&gt;Subitem 2.2&lt;/li&gt;
        &lt;/ul&gt;
        &lt;/li&gt;
        &lt;li&gt;Item 3&lt;/li&gt;
        &lt;/ul&gt;</code></pre>

      <h2>4. Links and Images</h2>
      <h3>Links:</h3>
      <pre><code>[Link Text](https://example.com)</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;a href="https://example.com"&gt;Link Text&lt;/a&gt;</code></pre>

      <h3>Images:</h3>
      <pre><code>![Alt Text](https://example.com/image.jpg)</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;img src="https://example.com/image.jpg" alt="Alt Text"&gt;</code></pre>

      <h2>5. Code Blocks</h2>
      <h3>Inline Code:</h3>
      <pre><code>`inline code`</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;code&gt;inline code&lt;/code&gt;</code></pre>

      <h3>Fenced Code Blocks:</h3>
      <pre><code>```
        Code content here
        ```</code></pre>

      <h3>Rendered HTML:</h3>
      <pre><code>&lt;pre&gt;&lt;code&gt;Code content here&lt;/code&gt;&lt;/pre&gt;</code></pre>

      <h2>15. Features Summary</h2>
      <table>
        <tr>
          <th>Feature</th>
          <th>Text-Based Syntax</th>
          <th>Icon-Based Syntax</th>
          <th>Purpose</th>
        </tr>
        <tr>
          <td>Headers & Text</td>
          <td># Header, **Bold**</td>
          <td>~✏️ Header, ~🌟 Bold</td>
          <td>Standard Markdown formatting.</td>
        </tr>
        <tr>
          <td>Italic</td>
          <td>*Italic Text*</td>
          <td>~🖋️ Italic Text</td>
          <td>Formats text as italic.</td>
        </tr>
        <tr>
          <td>Links</td>
          <td>[Link Text](URL)</td>
          <td>~🔗 [Link Text](URL)</td>
          <td>Adds hyperlinks to your content.</td>
        </tr>
        <tr>
          <td>Images</td>
          <td>![Alt Text](URL)</td>
          <td>~🖼️ [Alt Text](URL)</td>
          <td>Embeds an image with alternative text.</td>
        </tr>
        <tr>
          <td>Code Blocks</td>
          <td>```code block```</td>
          <td>~💻 code block</td>
          <td>Displays preformatted code.</td>
        </tr>
        <tr>
          <td>Generate AI Content</td>
          <td>~ai[BotName](prompt)</td>
          <td>~🤖 [BotName](prompt)</td>
          <td>Generates content based on the specified prompt.</td>
        </tr>
        <tr>
          <td>Include Markdown</td>
          <td>~mkd(url="URL")</td>
          <td>~📄(url="URL")</td>
          <td>Fetches and renders external Markdown.</td>
        </tr>
      </table>


    </>
  );
}
