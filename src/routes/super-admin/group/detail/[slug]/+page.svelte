<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
    import Navbar from "../../../../../components/navbar.svelte";
    import Footer from "../../../../../components/footer.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";
    import pagination from "../../../../../CustomPagination";
    import Pagination from "../../../../../components/pagination.svelte";
	import returnNada from "../../../../../CustomReturnNada";

    export let data

    let currentPage = 1
    let showRowData = 10

    let group = null
    let menteesReal = null
    let mentees = null
    let status = false

    let isEditState = false

    let getGroup = () => {
        ApiController({
            method:'POST',
            endpoint:`group/${data.params.slug}`
        }).then(response => {
            group = response?.data.data
            menteesReal = response.data.data.mentees.sort((a,b) => a.name < b.name ? -1 : 1)
            mentees = menteesReal
            status = true
        })
    }

    let kickMentee = (mentee_id) => {
        swal({
			title: "Are you sure?",
			text: "Are you sure want to kick selected Mentee?",
			icon: "warning",
			buttons:{
				cancel : {
					text : 'No!',
					value : null,
					visible : true,
					className : 'btn btn-outline-secondary',
					closeModal : true
				},
				confirm : {
					text : 'Yes Sure!',
					value : true,
					visible : true,
					className : 'btn btn-primary',
					closeModal : true
				}
			}
		}).then((willDelete) => {
			if (willDelete) {
                ApiController({
                    method:'POST',
                    endpoint:`mentee/kick`,
                    datas:{
                        mentee_id:mentee_id
                    }
                }).then(response =>{
                    if(response?.data.msg == 'success'){
                        swal("Poof! Mentee has been Kicked!", {
							icon: "success",
							button: {
								text : 'Okay!',
								value : true,
								visible : true,
								className : 'btn btn-primary',
								closeModal : true
							}
						})
                        getGroup()
                    }
                })
            }
        })
    }

    let filterMentee = () => {
        currentPage = 1
        mentees = menteesReal
        let tempMentees = mentees
        let targetName = jquery('#filter-name').val().toLowerCase()

        tempMentees = tempMentees.filter(m => {
            return m.name.toLowerCase().includes(targetName)
        })

        mentees = tempMentees
    }

    let toggleEdit = () => {
        isEditState = !isEditState
    }

    let edit = () => {
        console.log(group.id)
        if(jquery('#new-name').val() == ''){
            return swal({
				title: "Oops, you forgot something!",
				text: "Please insert Group Name!",
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
            method:'POST',
            endpoint:'group/edit/name',
            datas: {
                id : group.id,
                name : jquery('#new-name').val()
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
                    getGroup()
                    toggleEdit()
                })
            }
        })
    }

    onMount(async () => {
        getGroup()
    })
</script>

<svelte:head>
	<title>Groups | Detail</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="group" role='admin'/>
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
							window.location.href = '/super-admin/group'
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Groups /</span
					> Detail
				</h4>
                {#if status}
				<div class="row mb-3">
                    <div class="col-md-12 col-lg-12 mb-3">
                        <div class="card h-100">
                            <img class="card-img-top group-cap-img" src="/img/group-cap-cover.jpg" alt="Card cap">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <div id="group-name" class="d-flex flex-row gap-2">
                                            {#if !isEditState}
                                            <h5 class="card-title">{group.name}</h5>
                                            <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                            <i class='bx bx-edit text-warning' id="edit-trigger" on:mouseover={() => {
                                                jquery('#edit-trigger').css('cursor', 'pointer')
                                            }} on:click={() => {
                                                toggleEdit()
                                            }}></i>
                                            {:else}
                                            <div class="d-flex flex-row gap-3 mb-2">
                                                <input type="text" class="form-control" id="new-name" value="{group.name}">
                                                <div class="d-flex flex-row gap-2">
                                                    <button class="btn btn-sm btn-outline-secondary" on:click={() => toggleEdit()}>Cancel</button>
                                                    <button class="btn btn-sm btn-primary" on:click={() => edit()}>Save</button>
                                                </div>
                                            </div>
                                            {/if}
                                        </div>
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
                                <h6 class="card-subtitle text-muted">{group.mentor_skill == null ? 'Not Set' : group.mentor_skill}</h6>
                                <img class="img-fluid d-flex mx-auto my-4" src="http://127.0.0.1/mmis-api/public/{group.mentor_image}" alt="Card cap">
                                <div class="d-flex gap-2">
                                    <a href="https://wa.me/62{group.mentor_phone == null ? '' : group.mentor_phone.slice(1)}" target="_blank" class="btn btn-whatsapp text-nowrap form-control">
                                        <span class="tf-icons bx bxl-whatsapp"></span>&nbsp; Whatsapp
                                    </a>
                                    <a href="mailto:{group.mentor_email}" target="_blank" class="btn btn-email text-nowrap form-control">
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
										<input type="text" class="form-control" placeholder="Mentee Name" id="filter-name" on:keyup={() => {filterMentee()}}>
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
                                    {#if mentees.length > 0}
                                    {#if pagination(mentees, currentPage, showRowData).length == 0}
                                    {returnNada(currentPage = currentPage-1)}
                                    {/if}
                                    {#each pagination(mentees, currentPage, showRowData) as m, i}
                                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                    <tr id="data-{m.id}" on:click={() => window.location.href = `/super-admin/mentee/detail/${m.id}`}
                                        on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
                                        <td class="text-center">{m.number}</td>
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
                        <Pagination bind:currentPage={currentPage} bind:dataList={mentees} showRowData={showRowData}/>
                    </div>
                </div>
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>
