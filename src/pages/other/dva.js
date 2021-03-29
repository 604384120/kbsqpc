import React from 'react';
import { RenderDva } from "../comlibs";
import ProductList from './dva_list';
import dva_models from './dva_models';

export default function (props) {

    const Products = ({ dispatch, products }) => {
        function handleDelete(id) {
            dispatch({
                type: 'products/delete',
                payload: id,
            });
        }
        return (
            <div>
                <h2>List of Products</h2>
                <ProductList onDelete={handleDelete} products={products} />
                <div onClick={() => { dispatch({ type: 'products/add' }); }}> add +</div>
            </div>
        );
    };

    return (
        <RenderDva models={dva_models} component={Products} />
    )
}