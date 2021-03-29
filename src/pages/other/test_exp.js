const countReducer = (count, action) => {
    console.log(action)
    if (action === "add") {
        return count + 1;
    }
    if (action === "del") {
        return count - 1;
    }
};

export default countReducer;