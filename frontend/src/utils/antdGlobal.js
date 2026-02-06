let notification = null;
let message = null;
let modal = null;

export const setAntdGlobal = ({
    notification: n,
    message: m,
    modal: mo
}) => {
    notification = n;
    message = m;
    modal = mo;
};

export {
    notification,
    message,
    modal
};
