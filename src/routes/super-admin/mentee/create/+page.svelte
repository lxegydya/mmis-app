<script>
// @ts-nocheck

    import Sidebar from "../../../../components/sidebar.svelte";
    import Navbar from "../../../../components/navbar.svelte";
    import Footer from "../../../../components/footer.svelte";
    import jquery from "jquery";
	import ApiController from "../../../../ApiController";

    let countInsert = 1

    let createMentee = () => {
        let isError = false
        let data = []
        let formdata = new FormData()

        for (let index = 0; index < countInsert; index++) {
            if(jquery(`#id-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#name-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#gender-${index+1}`).val() == ''){
                isError = true
                return swal({
                    title: "Oops, you forgot something!",
                    text: "Please choose Gender!",
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

            if(jquery(`#university-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#major-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#semester-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#email-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#phone-${index+1}`).val() == ''){
                isError = true
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

            if(jquery(`#status-${index+1}`).val() == ''){
                isError = true
                return swal({
                    title: "Oops, you forgot something!",
                    text: "Please Choose Status!",
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

            formdata.append(`image-${index+1}`, jquery(`#image-${index+1}`).prop('files')[0])

            data.push({
                id: jquery(`#id-${index+1}`).val(),
                name: jquery(`#name-${index+1}`).val(),
                gender: jquery(`#gender-${index+1}`).val(),
                university: jquery(`#university-${index+1}`).val(),
                major: jquery(`#major-${index+1}`).val(),
                semester: jquery(`#semester-${index+1}`).val(),
                email: jquery(`#email-${index+1}`).val(),
                phone: jquery(`#phone-${index+1}`).val(),
                status: jquery(`#status-${index+1}`).val()
            })
        }

        if(isError){
            return
        }

        formdata.append('datas', JSON.stringify(data))

        ApiController({
            method:"POST",
            endpoint:`mentee/create`,
            datas:formdata,
            sendForm:true
        }).then(response => {
            if(response?.data.msg == 'success'){
                swal({
                    title : "Data Created Successfully!", 
                    text : `Your new Mentee${countInsert > 1 ? 's' : ''} data has been saved!`, 
                    icon: "success",
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
</script>

<svelte:head>
	<title>Mentees | Create</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="mentee" role='admin'/>
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
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentees /</span
					> Create
				</h4>
				<div class="row">
                    {#each Array(countInsert) as _, i}
                    <div class="col-md-12">
                        <div class="col-lg-6 col-md-12">
                            <div class="card mb-4">
                                <div class="card-header d-flex justify-content-between align-items-center">
                                    <h5 class="mb-0">Create Mentee {i+1}</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <label class="form-label" for="id-{i+1}">ID</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" class="form-control" id="id-{i+1}" placeholder="ID"/>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="name-{i+1}">Name</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="name-{i+1}" class="form-control" placeholder="Name"/>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="gender-{i+1}">Gender</label>
                                        <div class="input-group input-group-merge">
                                            <select id="gender-{i+1}" class="form-select">
                                                <option value="" selected hidden>Choose Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="university-{i+1}">University</label>
                                        <div class="input-group input-group-merge">
                                            <input type="text" id="university-{i+1}" class="form-control" placeholder="University"/>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-md-8">
                                            <label class="form-label" for="major-{i+1}">Major</label>
                                            <div class="input-group input-group-merge">
                                                <input type="text" id="major-{i+1}" class="form-control" placeholder="Major"/>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label" for="semester-{i+1}">Semester</label>
                                            <div class="input-group input-group-merge">
                                                <input type="number" id="semester-{i+1}" class="form-control" placeholder="Semester"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3 row">
                                        <div class="col-md-8">
                                            <label class="form-label" for="email-{i+1}">Email</label>
                                            <div class="input-group input-group-merge">
                                                <input type="text" id="email-{i+1}" class="form-control" placeholder="Email"/>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label" for="phone-{i+1}">Phone Number</label>
                                            <div class="input-group input-group-merge">
                                                <input type="text" id="phone-{i+1}" class="form-control" placeholder="Phone Number"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="status-{i+1}">Status</label>
                                        <div class="input-group input-group-merge">
                                            <select id="status-{i+1}" class="form-select">
                                                <option value="" selected hidden>Choose Status</option>
                                                <option value="Active">Active</option>
                                                <option value="Not-Active">Not-Active</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label for="image-{i+1}" class="form-label">Profile Picture</label>
                                        <input class="form-control" type="file" id="image-{i+1}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/each}
                    <div class="col-md-12">
                        <div class="col-md-6 px-0">
                            <div class="mb-3">
                                <button type="button" class="btn btn-outline-primary text-nowrap form-control" on:click={() => countInsert++}>
                                    <span class="tf-icons bx bx-plus me-1"></span>More
                                </button>
                            </div>
                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary form-control" on:click={() => {
                                    createMentee()
                                }}>Create Mentee{countInsert > 1 ? 's' : ''}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
</div>