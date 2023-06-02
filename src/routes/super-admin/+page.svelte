<script>
	import { onMount } from 'svelte';
	import ApiController from '../../ApiController';
	import jQuery from 'jquery'

	let doLogin = () => {
		let formdata = new FormData()
		formdata.append('role', 'admin')
		formdata.append('email', jQuery('#email').val())
		formdata.append('password', jQuery('#password').val())

		ApiController({
			method:"POST",
			endpoint: `login`,
			datas: formdata
		}).then(response => {
			// @ts-ignore
			let data = response.data.data
			if(data.login_permission == "granted"){
				window.location.href = '/super-admin/dashboard'
				window.localStorage.setItem('login-data', JSON.stringify({
					'email':data.email, 
					'username':data.username
				}))
			}else{
				alert('Login Failed!')
			}
		})
	}
</script>

<div class="container-xxl">
	<div class="authentication-wrapper authentication-basic container-p-y">
		<div class="authentication-inner">
			<!-- Register -->
			<div class="card">
				<div class="card-body">
					<!-- Logo -->
					<div class="app-brand justify-content-center">
						<a href="index.html" class="app-brand-link gap-2">
							<span class="app-brand-text demo text-body fw-bolder">MMIS</span>
						</a>
					</div>
					<!-- /Logo -->
					<h4 class="mb-2">Welcome to MSIB Mentees Information System! 👋</h4>
					<p class="mb-4">Please sign-in to your account and start the adventure</p>

					<div class="mb-3">
						<label for="email" class="form-label">Email or Username</label>
						<input
							type="text"
							class="form-control"
							id="email"
							name="email-username"
							placeholder="Enter your email or username"
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
						}}>Sign in</button>
					</div>
				</div>
			</div>
			<!-- /Register -->
		</div>
	</div>
</div>
