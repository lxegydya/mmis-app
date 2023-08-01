<script>
// @ts-nocheck

	import { onMount } from 'svelte';
	import ApiController from '../../ApiController';
	import jQuery from 'jquery'
	import swal from 'sweetalert';
	import jquery from 'jquery';
	import Cookie from 'js-cookie'

	let loginState = null

	let doLogin = () => {
		if(jQuery('#email').val() == ''){
			return swal({
				title: "Opps, you forgot something!",
				text: "Please insert your Email!",
				icon: "error",
				button: "Okay!",
			})
		}

		if(jQuery('#password').val() == ''){
			return swal({
				title: "Opps, you forgot something!",
				text: "Please insert your Password!",
				icon: "error",
				button: "Okay!",
			})
		}

		loginState = "start"

		let formdata = new FormData()
		formdata.append('role', 'admin')
		formdata.append('email', jQuery('#email').val())
		formdata.append('password', jQuery('#password').val())

		ApiController({
			method:"POST",
			endpoint: `login`,
			datas: formdata
		}).then(response => {
			loginState = "done"
			// @ts-ignore
			let data = response.data.data
			if(data.login_permission == "granted"){
				Cookie.set('role', 'admin', {expires : 1})
				Cookie.set('username', data.username, {expires : 1})
				Cookie.set('email', data.email, {expires : 1})
				window.location.href = '/super-admin/dashboard'
			}else{
				return swal({
					title: "Oops, something went wrong!",
					text: "Please enter correct both Email and Password!",
					icon: "error",
					button: "Okay!",
				})
			}
		})
	}

	onMount(async () => {
		if(Cookie.get('role') != undefined){
			if(Cookie.get('role') == 'admin'){
				window.location.href = '/super-admin/dashboard'
			}else{
				window.location.href = '/mentor/dashboard'
			}
		}
	})
</script>

<svelte:head>
	<title>Login | SuperAdmin</title>
	<html lang="en" />
</svelte:head>

<div class="container-xxl">
	<div class="authentication-wrapper authentication-basic container-p-y">
		<div class="authentication-inner">
			<!-- Register -->
			<div class="card">
				<div class="card-body">
					<!-- Logo -->
					<div class="d-flex flex-column align-items-center justify-content-center">
						<img src="img/learningx-logo.png" alt="" width="300">
					</div>
					<!-- /Logo -->
					<p class="mb-0">Welcome to MMaS Super Admin!</p>
					<h3 class="mb-3">Mentees Management System 👋</h3>

					<div class="mb-3">
						<label for="email" class="form-label">Email</label>
						<input
							type="text"
							class="form-control"
							id="email"
							name="email-username"
							placeholder="Email"
						/>
					</div>
					<div class="mb-3 form-password-toggle">
						<div class="d-flex justify-content-between">
							<label class="form-label" for="password">Password</label>
						</div>
						<div class="input-group input-group-merge">
							<input
								type="password"
								id="password"
								class="form-control"
								name="password"
								placeholder="············"
								aria-describedby="password"
							/>
							<span class="input-group-text cursor-pointer"><i class="bx bx-hide" /></span>
						</div>
					</div>
					<div class="mb-3">
						<button class="btn btn-primary d-grid w-100" on:click={() => {
							doLogin()
						}}>
						{#if loginState == null}
						Sign in
						{:else if loginState == 'start'}
						<div class="d-flex justify-content-center align-items-center">
							<div class="spinner-border spinner-border-sm" role="status" style="color: #fff;">
								<span class="visually-hidden">Loading...</span>
							</div>
						</div>
						{:else}
						Sign in
						{/if}
						</button>
					</div>
				</div>
			</div>
			<!-- /Register -->
		</div>
	</div>
</div>
