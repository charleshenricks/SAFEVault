const BASE_URL = 'http://localhost:5000';



export const USER_LOGIN_URL = BASE_URL + '/api/users/login';

export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

export const USER_EDIT_URL = BASE_URL + '/api/users/edit/';

export const GET_ADMIN_URL = BASE_URL + '/api/users/admin/';

export const GET_USERS_URL = BASE_URL + '/api/users/get/';

export const DELETE_USERS_URL = BASE_URL + '/api/users/delete/';

export const DELETE_ALL_USERS = BASE_URL + '/api/users/deleteAll/';

export const POST_REQUEST_URL = BASE_URL + '/api/request/';

export const UPDATE_REQUEST_URL = POST_REQUEST_URL + 'update/';

export const GET_REQUEST_URL = POST_REQUEST_URL + 'get/';

export const FIND_REQUEST_URL = POST_REQUEST_URL + 'find/';

export const DELETE_REQUEST_URL = POST_REQUEST_URL + 'delete/';

export const POST_ITEM_URL = BASE_URL + '/api/items/post';

export const CLAIM_ITEM_URL = BASE_URL + '/api/items/claim/';

export const APPROVE_URL = BASE_URL + '/api/items/approve/';

export const DENY_URL = BASE_URL + '/api/items/deny/';

export const CHANGE_URL = BASE_URL + '/api/items/change/';

export const ITEM_PROFILE_UPDATE = BASE_URL + '/api/items/profile/update/';

export const GET_FOUND_ITEM_URL = BASE_URL + '/api/items/found';

export const GET_LOST_ITEM_URL = BASE_URL + '/api/items/lost';

export const GET_FOUND_ITEM_SEARCH_URL = GET_FOUND_ITEM_URL + '/search/';

export const GET_LOST_ITEM_SEARCH_URL = GET_LOST_ITEM_URL + '/search/';

export const GET_INFO_ITEM = BASE_URL + '/api/items/info/';

export const GET_USER_POSTS = BASE_URL + '/api/items/user/posts/';

export const GET_ALL_POSTS = BASE_URL + '/api/items/all/posts/';

export const GET_USER_REQUESTS = BASE_URL + '/api/items/user/requests/';

export const GET_ALL_REQUESTS = BASE_URL + '/api/items/all/requests/';

export const EDIT_INFO_ITEM = BASE_URL + '/api/items/info/edit/';

export const EDIT_INFO_ITEM1 = BASE_URL + '/api/items/info/edit1/';

export const DELETE_ITEM = BASE_URL + '/api/items/delete-item/';

export const DELETE_ALL_ITEM = BASE_URL + '/api/items/deleteAll-item/';

export const LED_EDIT = BASE_URL + 'api/sensors/led_1';
