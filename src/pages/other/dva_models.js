
import { $ } from "../comlibs";

export default {
    namespace: 'products',
    state: [
        {
            id: 1,
            name: 'dva',
            desc: 'dva 首先是一个基于 redux 和 redux-saga 的数据流方案，然后为了简化开发体验，dva 还额外内置了 react-router 和 fetch，所以也可以理解为一个轻量级的应用框架。'
        },
        {
            id: 2,
            name: 'antd',
            desc: '服务于企业级产品的设计体系，基于确定和自然的设计价值观上的模块化解决方案，让设计者和开发者专注于更好的用户体验。'
        },
    ],
    reducers: {
        'delete': (state, { payload: id }) => {
            return state.filter(item => item.id !== id);
        },
    },
    effects: {
        *add(action, { call, put }) {
            let param = { a: 2 };
            let data = yield call(async () => await $.get("/releasenote/random", param));
            console.log(data)
            yield put({
                type: "delete",
                payload: 1 || data
            })
        },
    },
};