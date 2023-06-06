<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
    import Navbar from "../../../../../components/navbar.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";

    export let data

    let group = null
    let status = false

    let getGroup = () => {
        ApiController({
            method:'POST',
            endpoint:`group/${data.params.slug}`
        }).then(response => {
            group = response?.data.data
            group.mentees = sortData(group.mentees)
            status = true
        })
    }

    let sortData = (data) => {
        let menteesList = data
        menteesList = menteesList.sort((a,b) => {
            let x = a.name.toLowerCase()
            let y = b.name.toLowerCase()

            if(x>y){return 1}
            if(x<y){return -1}
            return 0
        })

        return menteesList
    }

    let kickMentee = (mentee_id) => {
        ApiController({
            method:'POST',
            endpoint:`mentee/kick`,
            datas:{
                mentee_id:mentee_id
            }
        }).then(response =>{
            if(response?.data.msg == 'success'){
                getGroup()
                alert('Mentee Kicked!')
            }
        })
    }

    onMount(async () => {
        getGroup()
    })
</script>

<div class="d-flex h-100">
	<Sidebar activePage="group" />
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
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Groups /</span
					> Detail
				</h4>
                {#if status}
				<div class="row mb-3">
                    <div class="col-md-12 col-lg-12 mb-3">
                        <div class="card h-100">
                            <img class="card-img-top group-cap-img" src="/img/elements/2.jpg" alt="Card image cap">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h5 class="card-title">{group.name}</h5>
                                        <p class="card-text">
                                            [{group.batch_name}] {group.program_name}
                                        </p>
                                    </div>
                                    <div class="d-flex flex-column align-items-center">
                                        <h1 class="card-title mb-0">{group.mentees.length}</h1>
                                        <p class="card-text">Mentees</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-md-3 col-lg-3 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">{group.mentor_name}</h5>
                                <h6 class="card-subtitle text-muted">{group.mentor_skill}</h6>
                                <img class="img-fluid d-flex mx-auto my-4" src="http://127.0.0.1/mmis-api/public/{group.mentor_image}" alt="Card image cap">
                                <div class="d-flex gap-2">
                                    <a href="https://wa.me/6{group.mentor_phone}" class="btn btn-whatsapp text-nowrap form-control">
                                        <span class="tf-icons bx bxl-whatsapp"></span>&nbsp; Whatsapp
                                    </a>
                                    <a href="mailto:{group.mentor_email}" class="btn btn-email text-nowrap form-control">
                                        <span class="tf-icons bx bx-envelope"></span>&nbsp; Email
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-9 col-lg-9 mb-3">
                        <div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Mentees</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <span class="input-group-text" id="basic-addon-search31"><i class="bx bx-search"></i></span>
										<input type="text" class="form-control" placeholder="Mentee Name" id="filter-name">
                                    </div>
                                    <button type="button" class="btn btn-primary text-nowrap" on:click={() => window.location.href = `/super-admin/group/assign/${group.id}`}>
                                        <span class="tf-icons bx bx-plus me-1"></span>Assign
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>No</th>
											<th>Name</th>
											<th>University</th>
											<th>Major</th>
											<th>Semester</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                            <th class="text-center">Action</th>
										</tr>
									</thead>
									<tbody>
                                    {#if group.mentees.length > 0}
                                    {#each group.mentees as m, i}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" on:click={() => window.location.href = `/super-admin/mentee/detail/${m.id}`}
                                        on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                        <td class="text-center">{i+1}</td>
                                        <td>{m.name}</td>
                                        <td>{m.university}</td>
                                        <td>{m.major}</td>
                                        <td class="text-center">{m.semester}</td>
                                        <td>{m.email}</td>
                                        <td>{m.phone}</td>
                                        <td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-danger" on:click={(event) => {
                                                event.stopPropagation()
                                                kickMentee(m.id)
                                            }}>Kick</button>
                                        </td>
                                    </tr>
                                    {/each}
                                    {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>
