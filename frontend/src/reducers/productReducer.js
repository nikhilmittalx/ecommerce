// import { accordionActionsClasses } from "@mui/material";
import {ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    ALL_PRODUCT_FAIL,
    CLEAR_ERRORS,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL
} from "../constants/productConstants"


export const productReducer = (state={product: {}}, action)=>{
    switch (action.type){
        case ALL_PRODUCT_REQUEST:
            // console.log("ireq")
            return {
                loading:true,
                products:[]
            };
        case ALL_PRODUCT_SUCCESS:
            // console.log("isuccess")
            return {
                loading:false,
                products:action.payload.products,
                productCount: action.payload.productCount,
                resultPerPage: action.payload.resultPerPage,
                filteredProductsCount: action.payload.filteredProductsCount
            };
        case ALL_PRODUCT_FAIL:
            // console.log("ifail")
            return {
                loading:true,
                error:action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null,
            };
        default:
            return state;
        
    }
}

export const productDetailsReducer = (state={product: {}}, action)=>{
    switch (action.type){
        case PRODUCT_DETAILS_REQUEST:
            // console.log("ireq")
            return {
                loading:true,
                ...state
            };
        case PRODUCT_DETAILS_SUCCESS:
            // console.log("isuccess")
            return {
                loading:false,
                product:action.payload
            };
        case PRODUCT_DETAILS_FAIL:
            // console.log("ifail")
            return {
                loading:true,
                error:action.payload
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error:null,
            };
        default:
            return state;
        
    }
}

// export const productDetailsReducer = (state = {product:{}}, action) =>{
//     switch(action.type){
//         case PRODUCT_DETAILS_REQUEST:
//             return {
//                 loading: true,
//                 ...state
//             }
//         case PRODUCT_DETAILS_SUCCESS:
//             return {
//                 loading: false,
//                 product: action.payload,
//             }
//         case PRODUCT_DETAILS_FAIL:
//             return {
//                 loading: false,
//                 error:action.payload,
//             }
//         case CLEAR_ERRORS:
//             return{
//                 ...state,
//                 error:null,
//             }
//         default:{
//             return state
//         }
        
//     }
// }