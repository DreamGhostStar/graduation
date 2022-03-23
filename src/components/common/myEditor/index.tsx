import React, { useRef, useState } from 'react';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig } from '@wangeditor/core';
import styles from './style.module.scss';
import { backIP, httpSuccessCode } from 'consts';
import { Button, message, Select } from 'antd';
import { addCaseApi } from 'api/case';
import { addPostApi } from 'api/posts';

const { Option } = Select;

type IType = 'case' | 'post';

export function MyEditor() {
    const [editor, setEditor] = useState<IDomEditor | null>(null) // 存储 editor 实例
    const [type, setType] = useState<IType>('case')
    const inputRef = useRef<HTMLInputElement>(null)

    // 菜单栏配置
    const toolbarConfig = {
        excludeKeys: [
            'fullScreen'
        ]
    };

    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {
        placeholder: '请输入内容...',
        MENU_CONF: {
            uploadImage: {
                server: `${backIP}/api/image`
            }
        },
        onCreated: (editor: IDomEditor) => {
            // 编辑器创建之后，记录 editor 实例，重要 ！！！ （有了 editor 实例，就可以执行 editor API）
            setEditor(editor)
        },
        onChange: (editor: IDomEditor) => {
            // editor 选区或者内容变化时，获取当前最新的的 content
            // console.log('changed', editor.children)
        },
        onFocus: (editor: IDomEditor) => {
            editor.focus();
        }
    }
    const handleChange = (value: IType) => {
        setType(value);
    }
    const handleSubmit = async () => {
        // editor?.clear()
        // editor?.dangerouslyInsertHtml('<p>xxxxxx</p>')
        const title = inputRef.current?.value;
        const content = editor?.getHtml();
        const introduction = editor?.getText();
        if (!title) {
            message.info('标题不能为空')
            return;
        }

        if (!content || !introduction) {
            message.info('内容不能为空')
            return;
        }

        const requestApiMap = {
            case: addCaseApi,
            post: addPostApi
        };

        const {code, message: msg} = await requestApiMap[type]({
            title,
            content,
            introduction
        });

        if (code === httpSuccessCode) {
            message.success('发布成功')
        } else {
            message.error(msg);
        }
    }

    return (
        <div className={styles.layout}>
            <div className={styles.toolbar_layout}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                />
            </div>
            <div className={styles.type_select_layout}>
                <Select value={type} style={{ width: 120 }} onChange={handleChange}>
                    <Option value="case">案件</Option>
                    <Option value="post">贴子</Option>
                </Select>
                <Button type='primary' onClick={handleSubmit}>发布</Button>
            </div>
            <div className={styles.editor_layout}>
                <div className={styles.title_layout}>
                    <input
                        type="text"
                        className={styles.title}
                        placeholder='请输入标题'
                        ref={inputRef}
                    />
                </div>
                <Editor
                    defaultConfig={editorConfig}
                    style={{
                        width: 750,
                        minHeight: 900
                    }}
                />
            </div>
        </div>
    );
}