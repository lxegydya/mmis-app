<script>
// @ts-nocheck

	import { onMount } from "svelte";
    import Navbar from "../../../components/navbar.svelte";
    import Sidebar from "../../../components/sidebar.svelte";
	import ApiController from "../../../ApiController";
    import Cookie from 'js-cookie'
    import jquery from "jquery";
	import toDate from "../../../CustomTime";

    let mentor = null
    let status = false
    let isHaveAccess = false

    let editMode = false

    let getMentorDetail = () => {
        ApiController({
            method : "GET",
            endpoint : `mentor/${Cookie.get('token')}`
        }).then(response => {
            mentor = response?.data.data
            console.log(mentor)

            isHaveAccess = Cookie.get('token') == mentor.id

            editMode = false
            status = true
        })
    }

    let updateMentor = () => {
        if(jquery('#name').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Mentor Name!",
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
            endpoint:`mentor/edit`,
            datas: {
                mentor_id:Cookie.get('token'),
                fullname:jquery('#name').val(),
                email:mentor.email,
                phone:jquery('#phone').val(),
                skill:jquery('#skill').val(),
                status:mentor.status
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                swal({
                    title : "Data Updated Successfully!", 
                    text : "Your Mentor data has been updated!", 
                    icon : "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                }).then(() => {
                    mentor = response.data.data
                    Cookie.set('username', mentor.fullname, {expires : 1})
                    window.location.reload()
                })
            }
        })
    }

    let resetProfilePicture = () => {
        ApiController({
            method:"POST",
            endpoint:`mentor/${Cookie.get('token')}/profile/reset-profile-picture`
        }).then(response => {
            swal({
                title : "Reset Successfully!", 
                text : "Your Mentor Profile Picture has been reset!", 
                icon : "success",
                button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
            }).then(() => {
                mentor = response?.data.data
                Cookie.set('image', mentor.image, {expires : 1})
                window.location.reload()
            })
        })
    }

    let changeProfilePicture = () => {
        let formdata = new FormData()
        formdata.append('image', jquery('#upload').prop('files')[0])

        ApiController({
            method:"POST",
            endpoint:`mentor/${Cookie.get('token')}/profile/set-profile-picture`,
            datas:formdata,
            sendForm:true
        }).then(response => {
            swal({
                title : "Changed Successfully!", 
                text : "Your Mentor Profile Picture has been changed!", 
                icon : "success",
                button: {
                    text : 'Okay!',
                    value : true,
                    visible : true,
                    className : 'btn btn-primary',
                    closeModal : true
                }
            }).then(() => {
                mentor = response?.data.data
                Cookie.set('image', mentor.image, {expires : 1})
                window.location.reload()
            })
        })
    }

    onMount(async () => {
        getMentorDetail()
    })

</script>

<svelte:head>
	<title>Mentors</title>
	<html lang="en" />

    <style>
        tr:hover{
            cursor: pointer;
        }
    </style>

</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">My Profile</h4>
                {#if status}
                <div class="row mb-4">
                    <div class="col-md-9">
                        <div class="card">
                            <div class="row g-0">
                                <div class="col-md-4 custom-card-image custom-card-border-radius" style="background-image: url('http://127.0.0.1/mmis-api/public/{mentor.image}');">
                                    <!-- svelte-ignore a11y-img-redundant-alt -->
                                    <!-- <img class="card-img card-img-left" src="http://127.0.0.1/mmis-api/public/{mentor.image}" alt="Mentor Picture"> -->
                                    <div class="position-relative h-100">
                                        <div class="position-absolute bottom-0 start-0 p-2 d-flex w-100">
                                            <label for="upload" class="btn btn-primary me-2 form-control">
                                                <span class="d-none d-sm-block">Change</span>
                                                <i class="bx bx-upload d-block d-sm-none"></i>
                                                <input type="file" id="upload" class="account-file-input d-none" hidden="" accept="image/png, image/jpeg" on:change={() => changeProfilePicture()}>
                                            </label>
                                            {#if mentor.image != 'uploads/mentors/profile_picture/default-profile.jpg'}
                                            <button type="button" class="btn btn-secondary account-image-reset form-control">
                                                <i class="bx bx-reset d-block d-sm-none"></i>
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <span class="d-none d-sm-block" on:click={() => resetProfilePicture()}>Reset</span>
                                            </button>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body pb-0">
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <h5 class="card-title mb-0">Personal Information</h5>
                                            </div>
                                            {#if isHaveAccess && !editMode}
                                            <div class="card-title">
                                                <a href="/mentor/setting/password" class="btn btn-sm btn-outline-primary">Reset Password</a>
                                                <button class="btn btn-sm btn-outline-warning" on:click={() => {
                                                    editMode = true
                                                }}>Edit</button>
                                            </div>
                                            {:else}
                                            <div class="card-title">
                                                <div class="d-flex gap-2">
                                                    <button class="btn btn-sm btn-primary" on:click={() => {
                                                        updateMentor()
                                                    }}>Save Changes</button>
                                                    <button class="btn btn-sm btn-outline-secondary" on:click={() => {
                                                        editMode = false
                                                    }}>Cancel</button>
                                                </div>
                                            </div>
                                            {/if}
                                        </div>
                                        {#if !editMode}
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Name</p>
                                                <p class="lead mb-0">{mentor.fullname}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Status</p>
                                                {#if mentor.status == 'Active'}
                                                <span class="badge bg-label-success">{mentor.status}</span>
                                                {:else}
                                                <span class="badge bg-label-danger">{mentor.status}</span>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Email Address</p>
                                                <p class="lead mb-0">{mentor.email}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Phone Number</p>
                                                <p class="lead mb-0">{mentor.phone == null ? 'Not-set' : mentor.phone}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <p class="text-muted mb-0">Skills</p>
                                                <p class="lead mb-0">{mentor.skill == null ? 'Not-set' : mentor.skill}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <p class="text-muted mb-0">Registered At</p>
                                                <p class="lead mb-0">{toDate(mentor.created_at)}</p>
                                            </div>
                                        </div>
                                        {:else}
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label for="name" class="">Name</label>
                                                <input class="form-control" type="text" id="name" value="{mentor.fullname}">
                                            </div>
                                            <div class="col-md-6">
                                                <label for="status" class="">Status</label>
                                                <input class="form-control" type="text" id="status" value="{mentor.status}" disabled>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <label for="email" class="">Email Address</label>
                                                <input class="form-control" type="text" id="email" value="{mentor.email}" disabled>
                                            </div>
                                            <div class="col-md-6">
                                                <label for="phone" class="">Phone Number</label>
                                                <input class="form-control" type="text" id="phone" value="{mentor.phone}">
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-12">
                                                <label for="skill" class="">Skills</label>
                                                <input class="form-control" type="text" id="skill" value="{mentor.skill}" placeholder={mentor.skill == null ? "Skill 1, Skill 2, ..." : ''}>
                                            </div>
                                        </div>
                                        {/if}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>