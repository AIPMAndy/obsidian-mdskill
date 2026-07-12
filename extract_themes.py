import json
import re

# 读取 MDSKILL templates.js
with open('/Users/andy/Documents/AICode/02 产品网站与服务端/MDSKILL/renderer/templates.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取主题定义（简化版本 - 只提取关键信息）
themes = {}

# 匹配主题定义块
pattern = r'(\w+):\s*{\s*id:\s*[\'"]([^"\']+)[\'"],\s*name:\s*[\'"]([^"\']+)[\'"],\s*description:\s*[\'"]([^"\']+)[\'"]'
matches = re.finditer(pattern, content)

for match in matches:
    theme_key = match.group(1)
    theme_id = match.group(2)
    theme_name = match.group(3)
    theme_desc = match.group(4)
    
    themes[theme_key] = {
        'id': theme_id,
        'name': theme_name,
        'description': theme_desc
    }

print(f"找到 {len(themes)} 个主题:")
for key, theme in themes.items():
    print(f"  {key}: {theme['name']} - {theme['description']}")

# 输出 JSON
with open('mdskill_themes.json', 'w', encoding='utf-8') as f:
    json.dump(themes, f, ensure_ascii=False, indent=2)

print(f"\n✓ 已保存到 mdskill_themes.json")
