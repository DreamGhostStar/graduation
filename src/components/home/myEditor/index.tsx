import React, { useCallback, useEffect, useState } from 'react';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig } from '@wangeditor/core';
import styles from './style.module.scss';
import { backIP, httpSuccessCode } from 'consts';
import { Button, message } from 'antd';
import { getCaseInfoApi } from 'api/case';
import { getPostsInfoApi } from 'api/posts';
import { useParams } from 'react-router-dom';
import { IHomeParams } from 'pages/home';
import EditorSetting from '../EditorSetting';

export type IEditorType = 'case' | 'post';

export function MyEditor() {
    const [editor, setEditor] = useState<IDomEditor | null>(null) // 存储 editor 实例
    const [type, setType] = useState<IEditorType>('case')
    const [id, setId] = useState<number | undefined>(undefined)
    const [visible, setVisible] = useState(false)
    // 是否是修改状态
    const [title, setTitle] = useState('')
    const params = useParams<IHomeParams>();

    const getContent = useCallback(async () => {
        if (!params.id) {
            return;
        }
        const [type, id] = params.id.split('-');
        const requestMap = {
            case: getCaseInfoApi,
            post: getPostsInfoApi
        };
        if ((type !== 'case' && type !== 'post') || id === undefined || !editor) {
            return;
        }
        const requestApi = requestMap[type];
        const { code, data, message: msg } = await requestApi({
            id: parseInt(id)
        });
        if (code === httpSuccessCode) {
            editor?.clear()
            editor?.dangerouslyInsertHtml(data.content);
            setTitle(data.title)
            setId(data.id)
            setType(type)
        } else {
            message.error(msg)
        }
    }, [editor, params.id])

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
    const handleSelectChange = (value: IEditorType) => {
        setType(value);
    }
    const clear = () => {
        setTitle('');
        editor?.clear();
    }
    useEffect(() => {
        getContent();
    }, [editor, getContent])


    return (
        <div className={styles.layout}>
            <div className={styles.toolbar_layout}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                />
            </div>
            <div className={styles.type_select_layout}>
                <Button type='primary' onClick={() => setVisible(true)}>
                    {id !== undefined ? '修改' : '发布'}
                </Button>
            </div>
            <div className={styles.editor_layout}>
                <div className={styles.title_layout}>
                    <input
                        type="text"
                        className={styles.title}
                        placeholder='请输入标题'
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
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
            <EditorSetting 
                visible={visible}
                setVisible={setVisible}
                type={type}
                title={title}
                editor={editor}
                id={id}
                handleSelectChange={handleSelectChange}
                clear={clear}
            />
        </div>
    );
}