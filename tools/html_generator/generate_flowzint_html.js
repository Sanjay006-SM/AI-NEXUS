const fs = require('fs');
const { marked } = require('marked');

const markdownFile = 'Flowzint_Handbook/markdown/Flowzint_Handbook.md';
const outputFile = 'Flowzint_Handbook/html/Flowzint_Handbook.html';

const markdownContent = fs.readFileSync(markdownFile, 'utf8');

const htmlBody = marked(markdownContent);

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flowzint Handbook</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f7f6;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 900px;
            margin: 40px auto;
            background: #fff;
            padding: 40px 60px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border-radius: 8px;
        }

        h1, h2, h3, h4, h5, h6 {
            color: #2c3e50;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }

        h1 {
            font-size: 2.5em;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            text-align: center;
        }
        
        h1:first-of-type {
            margin-top: 0;
        }

        h2 {
            font-size: 1.8em;
            border-bottom: 1px solid #eee;
            padding-bottom: 8px;
            color: #2980b9;
        }

        h3 {
            font-size: 1.4em;
            color: #34495e;
        }

        a {
            color: #3498db;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        p {
            margin-bottom: 1.2em;
            color: #4f5a65;
        }

        ul, ol {
            margin-bottom: 1.5em;
            padding-left: 20px;
            color: #4f5a65;
        }

        li {
            margin-bottom: 0.5em;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 2em;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f8f9fa;
            color: #2c3e50;
            font-weight: 600;
        }
        
        tr:hover {
            background-color: #f1f5f9;
        }

        blockquote {
            border-left: 5px solid #3498db;
            background-color: #ebf5fb;
            margin: 1.5em 0;
            padding: 15px 20px;
            border-radius: 0 4px 4px 0;
            color: #2c3e50;
            font-style: italic;
        }
        
        code {
            background-color: #f1f5f9;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #e74c3c;
        }
        
        pre {
            background-color: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 1.5em;
        }
        
        pre code {
            background-color: transparent;
            padding: 0;
            color: inherit;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
        }
        
        .alert-info {
            color: #31708f;
            background-color: #d9edf7;
            border-color: #bce8f1;
        }
        
        .alert-warning {
            color: #8a6d3b;
            background-color: #fcf8e3;
            border-color: #faebcc;
        }
        
        .alert-danger {
            color: #a94442;
            background-color: #f2dede;
            border-color: #ebccd1;
        }

        hr {
            border: 0;
            height: 1px;
            background: #eee;
            margin: 40px 0;
        }
        
        .header {
            text-align: center;
            margin-bottom: 50px;
        }
        
        .header p {
            font-size: 1.2em;
            color: #7f8c8d;
        }
        
        @media print {
            body {
                background: none;
            }
            .container {
                box-shadow: none;
                margin: 0;
                padding: 0;
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <p><strong>Flowzint Handbook</strong></p>
        </div>
        ${htmlBody}
    </div>
</body>
</html>
`;

// Simple replacement for GitHub alerts to CSS classes
let processedHtml = htmlTemplate
    .replace(/<blockquote>\s*<p>\[!NOTE\]/g, '<blockquote class="alert alert-info"><p><strong>Note:</strong>')
    .replace(/<blockquote>\s*<p>\[!IMPORTANT\]/g, '<blockquote class="alert alert-warning"><p><strong>Important:</strong>')
    .replace(/<blockquote>\s*<p>\[!WARNING\]/g, '<blockquote class="alert alert-danger"><p><strong>Warning:</strong>');

fs.writeFileSync(outputFile, processedHtml);
console.log('HTML handbook generated successfully at', outputFile);
