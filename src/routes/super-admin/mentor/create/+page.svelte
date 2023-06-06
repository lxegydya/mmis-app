<script>
	import Sidebar from '../../../../components/sidebar.svelte';
	import Navbar from '../../../../components/navbar.svelte';
	import jquery from 'jquery';
	import ApiController from '../../../../ApiController';

    let createMentor = () => {
        if(jquery('#password').val() != jquery('#password-confirmation').val()){
            alert('Password and Password Confirmation not match!')
            return
        }

        if(jquery('#password').val() == "" || jquery('#password-confirmation').val() == ""){
            alert('Fill the password!')
            return
        }

        let formdata = new FormData()
        formdata.append('fullname', jquery('#fullname').val())
        formdata.append('email', jquery('#email').val())
        formdata.append('phone', jquery('#phone').val())
        formdata.append('password', jquery('#password').val())
        formdata.append('skill', jquery('#skill').val())
        formdata.append('image', jquery('#image').prop('files')[0])

        ApiController({
            method:"POST",
            endpoint:`mentor/create`,
            datas:formdata,
            sendForm:true
        }).then(response => {
            if(response?.data.msg == 'success'){
                alert('Mentor Created!')
                window.location.href = '/super-admin/mentor'
            }
        })
    }

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
				<div class="row">
					<div class="col-md-12 col-lg-6">
						<div class="card mb-4">
							<div class="card-header d-flex justify-content-between align-items-center">
								<h5 class="mb-0">Create Meentor</h5>
							</div>
							<div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label" for="fullname">Fullname</label>
                                    <input type="text" class="form-control" id="fullname" placeholder="Fullname">
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6">
                                        <label class="form-label" for="email">Email</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="email" class="form-control" placeholder="Email"/>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label" for="phone">Phone Number</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="phone" class="form-control" placeholder="Phone Number"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3 row">
                                    <div class="col-md-6 form-password-toggle">
                                        <label for="password" class="col-form-label">Password</label>
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
                                    <div class="col-md-6 form-password-toggle">
                                        <label for="password-confirmation" class="col-form-label">Password Confirmation</label>
                                        <div class="input-group input-group-merge">
                                            <input
                                                type="password"
                                                id="password-confirmation"
                                                class="form-control"
                                                name="password-confirmation"
                                                placeholder="············"
                                                aria-describedby="password-confirmation"
                                            />
                                            <span class="input-group-text cursor-pointer"><i class="bx bx-hide" /></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="skill">Skill</label>
                                    <input type="text" class="form-control" id="skill" placeholder="Skill 1, Skill 2, ...">
                                </div>
                                <div class="mb-3">
                                    <label for="image" class="form-label">Profile Picture</label>
                                    <input class="form-control" type="file" id="image">
                                </div>
                                <button type="submit" class="btn btn-primary" on:click={() => {
                                    createMentor()
                                }}>Create</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
