import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig } from '@wangeditor/core';
import styles from './style.module.scss';
import { backIP, httpSuccessCode } from 'consts';
import { Button, message, Select } from 'antd';
import { addCaseApi, alterCaseInfoApi, getCaseInfoApi } from 'api/case';
import { addPostApi, alterPostsInfoApi, getPostsInfoApi } from 'api/posts';
import { useParams } from 'react-router-dom';
import { IHomeParams } from 'pages/home';

const { Option } = Select;

type IType = 'case' | 'post';

export function MyEditor() {
    const [editor, setEditor] = useState<IDomEditor | null>(null) // 存储 editor 实例
    const [type, setType] = useState<IType>('case')
    const [id, setId] = useState<number | undefined>(undefined)
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
    const handleChange = (value: IType) => {
        setType(value);
    }
    const handleSubmit = async () => {
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

        let requestApi;
        if (id) {
            const requestApiMap = {
                case: alterCaseInfoApi,
                post: alterPostsInfoApi
            };
            requestApi = requestApiMap[type];
        } else {
            const requestApiMap = {
                case: addCaseApi,
                post: addPostApi
            };
            requestApi = requestApiMap[type];
        }

        const { code, message: msg } = await requestApi({
            id,
            title,
            content,
            introduction
        });

        if (code === httpSuccessCode) {
            message.success(id !== undefined ? '修改成功' : '发布成功')
            setTitle('');
            editor?.clear();
        } else {
            message.error(msg);
        }
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
                <Select
                    value={type}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    disabled={id !== undefined}
                >
                    <Option value="case">案件</Option>
                    <Option value="post">贴子</Option>
                </Select>
                <Button type='primary' onClick={handleSubmit}>
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
        </div>
    );
}