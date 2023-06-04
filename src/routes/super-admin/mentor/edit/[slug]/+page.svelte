<script>
// @ts-nocheck

	import Sidebar from '../../../../../components/sidebar.svelte';
	import Navbar from '../../../../../components/navbar.svelte';
	import jquery from 'jquery';
	import ApiController from '../../../../../ApiController';
	import { onMount } from 'svelte';

    export let data;

    let mentorData = null
    let status = false

    let updateMentor = () => {
        ApiController({
            method:"POST",
            endpoint:`mentor/edit`,
            datas: {
                mentor_id:data.params.slug,
                fullname:jquery('#fullname').val(),
                email:jquery('#email').val(),
                phone:jquery('#phone').val(),
                skill:jquery('#skill').val(),
                status:jquery('#status').val()
            }
        }).then(response => {
            if(response?.data.msg == 'success'){
                alert('Mentor Updated!')
                window.location.href = '/super-admin/mentor'
            }
        })
    }

    let getMentor = () => {
        ApiController({
            method:"GET",
            endpoint:`mentor/${data.params.slug}`
        }).then(response => {
            mentorData = response?.data.data
            status = true
        })
    }

    let resetProfilePicture = () => {
        ApiController({
            method:"POST",
            endpoint:`mentor/${data.params.slug}/profile/reset-profile-picture`
        }).then(response => {
            console.log(response)
            mentorData = response?.data.data
        })
    }

    let changeProfilePicture = () => {
        let formdata = new FormData()
        formdata.append('image', jquery('#upload').prop('files')[0])

        ApiController({
            method:"POST",
            endpoint:`mentor/${data.params.slug}/profile/set-profile-picture`,
            datas:formdata,
            sendForm:true
        }).then(response => {
            mentorData = response?.data.data
        })
    }

    onMount(async () => {
        getMentor()
    })
</script>

<div class="d-flex h-100">
	<Sidebar activePage="mentor" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentors /</span
					> Create
				</h4>
                {#if status}
				<div class="row">
					<div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Edit Mentor</h5>
							</div>
							<div class="card-body">
                                <div class="d-flex align-items-start align-items-sm-center gap-4 mb-3">
                                    <img src="http://127.0.0.1/mmis-api/public/{mentorData.image}" alt="user-avatar" class="d-block rounded" height="100" width="100" id="image">
                                    <div class="button-wrapper">
                                        <label for="upload" class="btn btn-primary me-2 mb-4">
                                            <span class="d-none d-sm-block">Change</span>
                                            <i class="bx bx-upload d-block d-sm-none"></i>
                                            <input type="file" id="upload" class="account-file-input d-none" hidden="" accept="image/png, image/jpeg" on:change={() => changeProfilePicture()}>
                                        </label>
                                        {#if mentorData.image != 'uploads/mentors/profile_picture/default-profile.jpg'}
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
                                    <label class="form-label" for="fullname">Fullname</label>
                                    <input type="text" class="form-control" id="fullname" value="{mentorData.fullname}">
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="email" class="form-control" value="{mentorData.email}"/>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label" for="phone">Phone Number</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="phone" class="form-control" value="{mentorData.phone}"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="skill">Skill</label>
                                    <input type="text" class="form-control" id="skill" value="{mentorData.skill}">
                                </div>
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <select id="status" class="form-select">
                                        <option value="Active" selected={mentorData.status == 'Active' ? true : false}>Active</option>
                                        <option value="Non-Active" selected={mentorData.status == 'Non-Active' ? true : false}>Non-Active</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary" on:click={() => {
                                    updateMentor()
                                }}>Save Changes</button>
							</div>
						</div>
					</div>
				</div>
                {/if}
			</div>
		</div>
	</div>
</div>
