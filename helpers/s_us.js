const { serialize, unserialize, isSerialized } = require('php-serialize');

exports.my_serialize = async (item)=>{
    return serialize(item);
} 
exports.my_unserialize = async (item)=>{
    return unserialize(item);
} 
exports.my_isserialized = async (item)=>{
    return isSerialized(item);
}