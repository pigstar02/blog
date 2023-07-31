import os
import glob
import re
import yaml

# 定义处理函数
def process_markdown_file(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 解析元数据
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if match:
        metadata_str = match.group(1)
        metadata = yaml.load(metadata_str, Loader=yaml.SafeLoader)
        # 修改元数据
        # metadata['title'] = metadata['title'] + ' - Modified'
        metadata['layout'] = '../../layouts/MarkdownPost.astro'
        if 'date' in metadata:
          metadata['pubDate'] = metadata['date']
        metadata['author'] = 'pigstar'
        metadata['cover'] = {}
        metadata['cover']['url'] = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU'
        metadata['cover']['square'] = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmLBRw4ETs0pE0bP6OXse4jfMOotclHykLZEw-qP6LVonmdkTU5bu_ZuJyJqPB0tGWNHw&usqp=CAU' 
        metadata['cover']['alt'] = 'cover'
        metadata['description'] = ""
        metadata['tags'] = ['ACM', 'ICPC', '题解']
        metadata['theme'] = 'light'
        metadata['feature'] = True
        metadata['meta'] = [] 
        metadata['meta'].append({
            "name": 'author',
            "content": "pigstar"
        })
        metadata['meta'].append({
            "name": 'keywords',
            "content": "key3, key4"
        })
        
        metadata['keywords'] = {}
        metadata['keywords'] = "key1, key2, key3"  
        
        # 判断键是否存在，存在则删除
    # if 'date' in metadata:
    #     del metadata['date']
    # if 'feature' in metadata:
    #     del metadata['feature']
    # if 'hideInList' in metadata:
    #     del metadata['hideInList']
    # if 'isTop' in metadata:
    #     del metadata['isTop']
    # if 'published' in metadata:
    #     del metadata['published']
    # if 'tags' in metadata:
    #     del metadata['tags']
        # 规定允许的键列表
        allowed_keys = [
            "author",
            "cover",
            "keywords",
            "layout",
            "meta",
            "pubDate",
            "theme",
            "title",
            "tags",
            'description'
        ]
        remove_keys = []
        # 遍历所有的键值对
        for key, value in metadata.items():
            # 如果键不在规定的列表中，就删除该键值对
            if key not in allowed_keys:
                remove_keys.append(key)
        for key in remove_keys:
            del metadata[key]
        
        for key in allowed_keys:
            if key not in metadata:
                print(file_path)
                break

        # 重新写入文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write('---\n')
            f.write(yaml.dump(metadata, default_flow_style=False, allow_unicode=True))
            f.write('---\n')
            f.write(match.group(2))
print(os.getcwd()+'/posts')
# 遍历当前路径下的所有Markdown文件
for filename in glob.glob("posts/*.md"):
    # 处理每个文件
    file_path = os.path.join(os.getcwd(), filename)
    # print(filename)
    process_markdown_file(file_path)