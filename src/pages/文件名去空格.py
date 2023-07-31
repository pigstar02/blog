import os
import shutil

# 获取当前目录
dir_path = os.getcwd()+"/posts"

# 遍历当前目录下的所有文件
for filename in os.listdir(dir_path):
    # 判断文件名中是否包含空格
    if ' ' in filename:
        # 将空格替换为下划线
        new_filename = filename.replace(' ', '_')
        # 构造新的文件路径
        old_path = os.path.join(dir_path, filename)
        new_path = os.path.join(dir_path, new_filename)
        print(new_filename)
        # 修改文件名
        shutil.move(old_path, new_path)