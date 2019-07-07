import { PixelRatio, Platform } from "react-native";

export default {
/********************** Header ********************/
    titleHeader: {
        color: "#FFFFFF"
    },

/********************** Footer ********************/

    footer: {
        borderTopWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: '#cbcbcb',
        elevation: 3
    },
    footerContainer: {
        backgroundColor: '#fff'
    },
    textButton: {
        fontSize: Platform.OS === "ios" ? 8 : 10
    },

/********************** Categories ********************/
    btnCategory: {
        borderRadius: 5,
        backgroundColor: '#fff',
        marginRight: 5,
        marginTop: 4,
        marginBottom: 4,
    },
    btnCategoryActive: {
        borderRadius: 5,
        backgroundColor: '#fc6914',
        marginRight: 5,
        marginTop: 4,
        marginBottom: 4,
    },
    textCategory: {
        color: '#000',
    },
    textCategoryActive: {
        color: '#fff',
    },
    showTags: {
        flexDirection: "row", 
        flexWrap: 'wrap',
    },
    hideTags: {
        flexDirection: "row", 
        flexWrap: 'wrap',
        display: 'none',
    },

/********************** Lists ********************/
    itemList: {
        flexDirection: "row",
        marginLeft: 0,
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: 8
    },
    thumbnailContent: {
        flex: 1,
        height: 140,
        marginLeft: 0,
        marginRight: 0
    },
    imageThumbnail: {
        flex: 1,
        width: null,
        height: 140
    },
    contentView: {
        flex: 2,
        flexDirection: "column",
        height: 140,
        paddingTop: 10,
        marginLeft: 10
    }
};
