$(document).ready(function () {
    let Modal = $('#editModalCenter');
    let LoginModal = $('#loginModal');
    let TrackingsModal = $('#trackingsModal');
    let Tag = $('#tag')
    let TagEdit = $('#tagEdit')
    let clearBtn = $('#clearBtn')
    var saveBtn = $('#saveBtn')
    var deleteBtn = $('#deleteBtn')
    var updateBtn = $('#updateBtn')
    var loginBtn = $('#loginBtn')
    var loginBtnAction = $('#loginBtnAction')
    var imgEditPreview = $('#imgEditPreview')
    var dropZone = $('#dropzone')
    var preview = document.getElementById('preview')
    var loadingDiv = document.getElementById('loading')

    /**
     * API Service Function
     * @param {url api, method, body data} paramObject
     * @returns 
     */
    var api = ({url,type,body}) => {
       return new Promise((resolve)=>{
        $.ajax({
            type,
            url,
            data:body,
            dataType: 'json',
            headers: {
                "Token": localStorage.getItem('CognitoToken') // Cognito Token Auth - Its only work when deploy on AWS API Gateway 
            },
            success: function (result){
                resolve(result);
            }
        });
       })
    }

    /**
     * Upload Function
     * @param {signature object} presignedPostData 
     * @param {file object} file 
     * @returns 
     */
    var uploadS3 = (presignedPostData, file) => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          Object.keys(presignedPostData.fields).forEach(key => {
            formData.append(key, presignedPostData.fields[key]);
          });
          formData.append("file", file);
          const xhr = new XMLHttpRequest();
          xhr.open("POST", presignedPostData.url, true);
          xhr.send(formData);
          xhr.onload = function() {
            this.status === 204 ? resolve({
              size:file.size,
              name:file.name,
              url:presignedPostData.url + '/'+presignedPostData.fields.key,
              _id: presignedPostData.fields.imageId
            }) : resolve({error:true});
          };
        });
    }

    /**
     * Date Parse Function
     * @param {date value} d 
     * @returns date format DD/MM/YYYY - h:mmA
     */
    var dateParse = (d)=>{
        return d ? moment(d).format('DD/MM/YYYY - h:mmA') : '';
    }

    /**
     * Clear Function
     */
    var clear = ()=>{
        var preview = document.getElementById('preview');
        preview.style.backgroundImage = ''
        window.imageObject = undefined;
        Tag.tagsinput('removeAll');
    }

    /**
     * Close Modal
     */
     var closeModal = ()=>{
        Modal.modal('hide');
        LoginModal.modal('hide');
        TrackingsModal.modal('hide');
    }

    /**
     * Loading Function
     */
    var loading = (show)=>{
        loadingDiv.style.display = show?'block':'none';
    }

     /**
     * Append Tr Table
     */
      var appendTr = (e)=>{
        $('table tbody tr:first').after(
            `<tr>
                <td scope="row">${e.name}</td>
                <td>
                <a class="text-primary edit" data-url="${e.url}" data-id="${e._id}" data-tags="${e.tags.toString()}">${e.tags.toString()}</a>
                </td>
                <td>${dateParse(e.createdAt)}</td>
                <td>${dateParse(e.updatedAt)}</td>
                <td><a class="text-primary tracking" data-id="${e._id}">View</a></td>
            </tr>`
        );
    }

    /** Start drag/drop to upload image to s3 */
    dropZone.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
    })
    dropZone.on('drop', async function (e) {
        var files = e.originalEvent.dataTransfer.files;
        var f = files[0];
        if(f && f.type.includes('image')){
            loading(true);
            var signData = await api({
                url:'/photos/sign',
                type:'POST',
                body:{
                    name:f.name
                }
            })
            var dataImage = await uploadS3(signData,f);
            if(!dataImage.error){
                preview.style.backgroundImage = `url(${dataImage.url})`
                window.imageObject = dataImage;
            }
            loading();
        }
    });

    /**
     * Login Action
     */
    loginBtn.click(e=>{
        LoginModal.modal('show');
    });
    
    loginBtnAction.click(async e=>{
        var email = $('#email').val();
        var password = $('#password').val();
        if(email && password){
            loading(true);
            var res = await api({
                url:'/users/login',
                type:'POST',
                body:{email,password}
            });
            if(res.code){
                alert(res.code);
            }else{
                localStorage.setItem('CognitoToken',res.cognitoToken);
                checkLogin();
                closeModal();
            }
            loading();
        }
        
    });

    /**
     * View Tracking Action
     */
     $(document).on('click','td a.tracking', async function (e) {
        $('table.trackings tbody tr').empty();
        loading(true);
        var photoId = $(this).data('id');
        var res = await api({
            url:'/trackings/'+photoId,
            type:"GET"
        });
        $.each(res, function (i,e) { 
            $('table.trackings tbody tr:first').after(
                `<tr>
                    <td scope="row">${e.action}</td>
                    <td>${e.userByName}</td>
                    <td>${dateParse(e.createdAt)}</td>
                </tr>`
            );
        });
        loading();
        TrackingsModal.modal('show');
    });

    /**
     * Edit Action
     */
    $(document).on('click','td a.edit',function (e) {
        imgEditPreview.attr('src',$(this).data('url')),
        window._id = $(this).data('id');
        var tags = $(this).data('tags');
        TagEdit.tagsinput('removeAll');
        (tags || '').split(',').forEach(e=>{
            TagEdit.tagsinput('add', e.trim());
        })
        Modal.modal('show');
    });

    

    $(document).on('click','.close',function () {
        closeModal()
    });

    updateBtn.click(async function (e) { 
        loading(true);
        var tags = TagEdit.tagsinput('items');
        var obj = {
            tags:tags
        }
        var res = await api({
            url:'/photos/'+window._id,
            type:"PATCH",
            body:obj
        });
        if(res.status){
            Modal.modal('hide');
        }
        loading();
        location.reload();
    });

    deleteBtn.click(async function (e) { 
        loading(true);
        var res = await api({
            url:'/photos/'+window._id,
            type:"DELETE",
        });
        if(res.status){
            Modal.modal('hide');
        }
        loading();
        location.reload();
    });
    
    /**
     * Clear Action
     */
    clearBtn.on('click',clear);

    /**
     * Save Action
     */
    saveBtn.on('click', async function () {
        var tags = Tag.tagsinput('items');
        if(window.imageObject && tags.length){
           loading(true);
            var obj = {
                ...window.imageObject,
                tags:tags
            }
           var res = await api({
                url:'/photos',
                type:"POST",
                body:obj
            });
            if(res.status){
                appendTr({...obj,createdAt:moment().valueOf()})
                clear();
            }
            loading();
        }else{
            alert('Please select image and tags')
        }
    })


    /**
     * Get list function
     */
    var getList = async()=>{
        var dataList = await api({
            url:'/photos',
            type:"GET"
        });
        $.each(dataList, function (i,e) { 
            appendTr(e);
        });
    }

    var checkLogin = async()=>{
        var CognitoToken = localStorage.getItem('CognitoToken');
        document.getElementById('loginBtn').style.display = !CognitoToken?'block':'none';
    }

    /**
     * First Running
     */
    checkLogin();
    getList();

});