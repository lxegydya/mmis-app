<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
    import Navbar from "../../../../../components/navbar.svelte";
    import Footer from "../../../../../components/footer.svelte";
    import jquery from "jquery";
	import ApiController from "../../../../../ApiController";
    import { onMount } from "svelte";
    import Cookie from 'js-cookie'

    export let data

    let mentee = null
    let status = false

    let isHaveAccess = false

    let getMentee = () => {
        ApiController({
            method:"POST",
            endpoint:`mentee/detail`,
            datas:{mentee_id:data.params.slug}
        }).then(response => {
            mentee = response?.data.data

            if(mentee.mentor_assigned == Cookie.get('token')){
                isHaveAccess = true
            }else{
                swal({
					title: "Access Denied!",
					text: 'You dont have access to Edit this Data',
					icon: "warning",
					button: {
						text : 'Oops Sorry!',
						value : true,
						visible : true,
						className : 'btn btn-primary',
						closeModal : true
					}
				}).then(action => {
					window.location.href = `/mentor/mentee/detail/${data.params.slug}`
				})
            }

            status = true
        })
    }

    let resetProfilePicture = () => {
        ApiController({
            method:"POST",
            endpoint:`mentee/${data.params.slug}/profile/reset-profile-picture`
        }).then(response => {
            swal({
                title : "Reset Successfully!", 
                text : "Your Mentee Profile Picture has been reset!", 
                icon : "success",
                button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
            })
            mentee = response?.data.data
        })
    }

    let changeProfilePicture = () => {
        let formdata = new FormData()
        formdata.append('image', jquery('#upload').prop('files')[0])

        ApiController({
            method:"POST",
            endpoint:`mentee/${data.params.slug}/profile/set-profile-picture`,
            datas:formdata,
            sendForm:true
        }).then(response => {
            swal({
                title : "Changed Successfully!", 
                text : "Your Mentee Profile Picture has been changed!", 
                icon : "success",
                button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
            })
            mentee = response?.data.data
        })
    }

    let updateMentee = () => {
        if(jquery('#id').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert MSIB ID!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#name').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Name!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#university').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert University!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#major').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Major!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#semester').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Semester!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#email').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Email!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        if(jquery('#phone').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Phone Number!",
				icon: "error",
				button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
			})
        }

        ApiController({
            method:"POST",
            endpoint:`mentee/edit`,
            datas:{
                mentee_id:mentee.id,
                name:jquery('#name').val(),
                gender:jquery('#gender').val(),
                university:jquery('#university').val(),
                major:jquery('#major').val(),
                semester:jquery('#semester').val(),
                email:jquery('#email').val(),
                phone:jquery('#phone').val(),
                status:jquery('#status').val()
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                swal({
                    title : "Data Updated Successfully!", 
                    text : "Your Mentee data has been updated!", 
                    icon : "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                }).then(() => {
                    window.location.href = '/super-admin/mentee'
                })
            }
        })
    }

    onMount(async () => {
        getMentee()
    })
</script>

<svelte:head>
	<title>Mentees | Edit</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.location.href = `/mentor/mentee/detail/${data.params.slug}`
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentees /</span
					> Edit
				</h4>
                {#if status}
                <div class="row">
                    <div class="col-lg-6 col-md-12">
                        <div class="card mb-4">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Edit Mentee</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex align-items-start align-items-sm-center gap-4 mb-3">
                                    <img src="http://127.0.0.1/mmis-api/public/{mentee.image}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="image">
                                    <div class="button-wrapper">
                                        <label for="upload" class="btn btn-primary me-2 mb-4">
                                            <span class="d-none d-sm-block">Change</span>
                                            <i class="bx bx-upload d-block d-sm-none"></i>
                                            <input type="file" id="upload" class="account-file-input d-none" hidden="" accept="image/png, image/jpeg" on:change={() => changeProfilePicture()}>
                                        </label>
                                        {#if mentee.image != 'uploads/mentees/profile_picture/default-profile.jpg'}
                                        <button type="button" class="btn btn-outline-secondary account-image-reset mb-4">
                                            <i class="bx bx-reset d-block d-sm-none"></i>
                                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                                            <span class="d-none d-sm-block" on:click={() => resetProfilePicture()}>Reset</span>
                                        </button>
                                        {/if}
                            
                                        <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="id">ID</label>
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="id" value="{mentee.id}" disabled/>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="name">Name</label>
                                    <div class="input-group input-group-merge">
                                        <input type="text" id="name" class="form-control" value="{mentee.name}"/>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="gender">Gender</label>
                                    <div class="input-group input-group-merge">
                                        <select id="gender" class="form-select">
                                            <option value="Male" selected={mentee.gender == 'Male' ? true : false}>Male</option>
                                            <option value="Female" selected={mentee.gender == 'Female' ? true : false}>Female</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="university">University</label>
                                    <div class="input-group input-group-merge">
                                        <input type="text" id="university" class="form-control" value="{mentee.university}"/>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-8">
                                        <label class="form-label" for="major">Major</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="major" class="form-control" value="{mentee.major}"/>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="semester">Semester</label>
                                        <div class="input-group input-group-merge">
                                            <input type="number" id="semester" class="form-control" value="{mentee.semester}"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-8">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="email" class="form-control" value="{mentee.email}"/>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label" for="phone">Phone Number</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="phone" class="form-control" value="{mentee.phone}"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="status">Status</label>
                                    <div class="input-group input-group-merge">
                                        <select id="status" class="form-select">
                                            <option value="Active" selected={mentee.status == 'Active' ? true : false}>Active</option>
                                            <option value="Not-Active" selected={mentee.status == 'Not-Active' ? true : false}>Not-Active</option>
                                        </select>
                                    </div>
                                </div>
                                <button class="btn btn-outline-secondary" on:click={() => window.location.href = `/mentor/mentee/detail/${data.params.slug}`}>Cancel</button>
                                <button type="submit" class="btn btn-primary" on:click={() => {
                                    updateMentee()
                                }}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>