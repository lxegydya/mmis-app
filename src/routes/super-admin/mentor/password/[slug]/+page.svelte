<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import Navbar from "../../../../../components/navbar.svelte";
    import Sidebar from "../../../../../components/sidebar.svelte";
    import ApiController from "../../../../../ApiController";
    import Cookie from 'js-cookie'
    import jquery from "jquery";

    export let data

    let resetPassword = () => {
        if(jquery('#new-password').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert New Password!",
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

        if(jquery('#new-password-confirmation').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert New Password Confirmation!",
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

        if(jquery('#new-password').val() != jquery('#new-password-confirmation').val()){
            return swal({
				title: "Oops, you forgot something!",
				text: "New Password and New Password Confirmation not match!",
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
            method : "POST",
            endpoint : `mentor/${data.params.slug}/password/reset`,
            datas : {
                role : Cookie.get('role'),
                new_password : jquery('#new-password').val(),
                password_confirm : jquery('#new-password-confirmation').val()
            }
        }).then(response => {
            if(response.data.result == 'success'){
                swal({
                    title : "Reset Success!", 
                    text : response.data.msg, 
                    icon : "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                }).then(res => {
                    window.history.back()
                })
            }
        })
    }

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
    <Sidebar activePage="mentor" role='admin'/>
    <div class="w-100 d-flex flex-column">
        <Navbar role='admin'/>
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
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentors / Edit / </span
					> Reset Password
				</h4>
                <div class="row">
                    <div class="col-md-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Reset Password</h5>
							</div>
                            <div class="card-body">
                                <div class="mb-3 row">
                                    <div class="col-md-6 form-password-toggle">
                                        <label for="new-password" class="col-form-label">New Password</label>
                                        <div class="input-group input-group-merge">
                                            <input type="password" id="new-password" class="form-control" placeholder="············" />
                                            <span class="input-group-text cursor-pointer"><i class="bx bx-hide" /></span>
                                        </div>
                                    </div>
                                    <div class="col-md-6 form-password-toggle">
                                        <label for="new-password-confirmation" class="col-form-label">New Password Confirmation</label>
                                        <div class="input-group input-group-merge">
                                            <input type="password" id="new-password-confirmation" class="form-control" name="password-confirmation" placeholder="············" />
                                            <span class="input-group-text cursor-pointer"><i class="bx bx-hide" /></span>
                                        </div>
                                    </div>
                                </div>
                                <button class="btn btn-outline-secondary" on:click={() => {
                                    window.history.back()
                                }}>Cancel</button>
                                <button type="submit" class="btn btn-primary" on:click={() => {
                                    resetPassword()
                                }}>Reset Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>