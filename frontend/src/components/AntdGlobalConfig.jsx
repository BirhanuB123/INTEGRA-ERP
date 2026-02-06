import { App } from 'antd';
import { setAntdGlobal } from '@/utils/antdGlobal';

export default function AntdGlobalConfig() {
    const { notification, message, modal } = App.useApp();

    setAntdGlobal({ notification, message, modal });

    return null;
}
