// 内容不能为空

function checkEmpty(...form){
    form.forEach(item=>{
        if(!item){
            return {word:'信息不完整',result:false}
        }
    })
    return {result:true}
}

function checkPhone(phone){
    if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){
        return {word:'手机号码有误',result:false}; 
    } 
    return {result:true}
}

module.exports ={
    checkEmpty,
    checkPhone
}