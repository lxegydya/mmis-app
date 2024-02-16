<script>
// @ts-nocheck

	import { onMount } from "svelte";
	import ApiController from "../../../../../ApiController";
    import Navbar from "../../../../../components/navbar.svelte";
    import Sidebar from "../../../../../components/sidebar.svelte";
    import Footer from "../../../../../components/footer.svelte";
    import jquery from "jquery";
	import Cookie from "js-cookie";
    import CryptoJs from "crypto-js";

    export let data

    let mentee = null
    let status = false

    let isHaveAccess = false

    let getMentee = () => {
        ApiController({
            method:"POST",
            endpoint:`mentee/detail`,
            datas:{
                mentee_id:data.params.slug
            }
        }).then(response => {
            mentee = response?.data.data

            if(mentee.mentor_assigned == Cookie.get('token')){
                isHaveAccess = true
            }

            status = true
        })
    }

    let buttonVisibility = (data) => {
		let currentScore = jquery(`#score-${data.assignment_id}`).val() == "" ? 0 : jquery(`#score-${data.assignment_id}`).val()
		let dbScore = data.score == null ? 0 : data.score

		if(currentScore != dbScore){
			jquery(`#save-${data.assignment_id}`).removeClass('invisible')
		}else{
			jquery(`#save-${data.assignment_id}`).addClass('invisible')
		}
	}

    let submitScore = (data) => {
		ApiController({
			method:"POST",
			endpoint:'scoring/appraise',
			datas:{
				scoring_id : data.scoring_id,
				assignment_id : data.assignment_id,
				mentee_id : mentee.id,
				score : data.score
			}
		}).then(response => {
			if(response.data.msg == 'success'){
				swal({
                    title : "Data Saved Successfully!", 
                    text : "Your Mentee Score has been recorded!", 
                    icon: "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                })
				getMentee()
				buttonVisibility(data)
			}
		})
	}

    let absence = (checkboxs, data) => {
        checkboxs.forEach(elm => {
            jquery(`#${elm}`).attr('disabled', true)
        })

		ApiController({
			method:"POST",
			endpoint:'absence/input',
			datas:{
				activity_id: data.activity_id,
				absence_list : [{
                    id: mentee.id,
                    absence_id: data.absence_id, 
                    present: data.present,
                    information: data.information
                }] 
			}
		}).then(response => {
			if(response.data.msg = 'success'){
				swal({
                    title : "Absence Saved Successfully!", 
                    text : "Your Mentees Absence have been recorded!", 
                    icon: "success",
                    button: {
                        text : 'Okay!',
                        value : true,
                        visible : true,
                        className : 'btn btn-primary',
                        closeModal : true
                    }
                })

                getMentee()
                
                checkboxs.forEach(elm => {
                    jquery(`#${elm}`).removeAttr('disabled')
                })

                document.getElementById(`absence-info-${data.assignment_id}`).disabled = false
			}
		})
	}

    let deleteMentee = menteeId => {
        swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this data!",
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
                    method:"POST",
                    endpoint:`mentee/delete`,
                    datas:{mentee_id : menteeId}
                }).then(response => {
                    if(response?.data.msg == "success"){
                        swal("Poof! Data has been deleted!", {
							icon: "success",
							button: {
								text : 'Okay!',
								value : true,
								visible : true,
								className : 'btn btn-primary',
								closeModal : true
							}
						})
                        window.location.href = '/super-admin/mentee'
                    }
                })
            }
        })
    }

    onMount(async () => {
        getMentee()
    })
</script>

<svelte:head>
	<title>Mentees | Detail</title>
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
							window.location.href = '/super-admin/mentee';
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Mentees /</span
					> Detail
				</h4>
                {#if status}
                <div class="row mb-4">
                    <div class="col-md-9">
                        <div class="card">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <!-- svelte-ignore a11y-img-redundant-alt -->
                                    <img class="card-img card-img-left" src="http://127.0.0.1/mmis-api/public/{mentee.image}" alt="Card image">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body pb-0">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h5 class="card-title mb-0">{mentee.name}</h5>
                                            </div>
                                            <div>
                                                <button class="btn btn-sm btn-outline-warning" on:click={
                                                    window.location.href = `/super-admin/mentee/edit/${mentee.id}`
                                                }>Edit</button>
                                                <button class="btn btn-sm btn-outline-danger" on:click={(event) => {
                                                    deleteMentee(mentee.id)
                                                }}>Delete</button>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">MSIB ID</p>
                                                <p class="lead mb-0">{mentee.id}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Status</p>
                                                {#if mentee.status == 'Active'}
                                                <span class="badge bg-label-success">{mentee.status}</span>
                                                {:else}
                                                <span class="badge bg-label-danger">{mentee.status}</span>
                                                {/if}
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Email</p>
                                                <p class="lead mb-0">{mentee.email}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Phone</p>
                                                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                                <p id="phone-number" class="lead mb-0" on:mouseover={() => {
                                                    jquery('#phone-number').css('cursor', 'pointer')
                                                }} on:click={() => window.open(`https://wa.me/62${mentee.phone}`, '_blank')}>{mentee.phone}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Gender</p>
                                                <p class="lead mb-0">{mentee.gender}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">University</p>
                                                <p class="lead mb-0">{mentee.university}</p>
                                            </div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Major</p>
                                                <p class="lead mb-0">{mentee.major}</p>
                                            </div>
                                            <div class="col-md-6">
                                                <p class="text-muted mb-0">Semester</p>
                                                <p class="lead mb-0">{mentee.semester}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 col-lg-3">
                        <div class="card {mentee.group_assigned != 'Not Assign Yet!' ? 'h-100' : ''}">
                            <div class="card-body">
                                <div class="row {mentee.group_assigned != 'Not Assign Yet!' ? 'mb-3' : ''}">
                                    <div class="col-md-12">
                                        <p class="text-muted mb-0">Program</p>
                                        <p class="lead mb-0">{mentee.program_assigned}</p>
                                    </div>
                                </div>
                                {#if mentee.group_assigned != 'Not Assign Yet!'}
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <p class="text-muted mb-0">Group's Name</p>
                                        <p class="lead mb-0">{mentee.group_assigned.name}</p>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <p class="text-muted mb-0">Mentor's Name</p>
                                        <p class="lead mb-0">{mentee.group_assigned.fullname}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-12">
                                        <p class="text-muted mb-1">Mentor's Contact</p>
                                        <div class="d-flex gap-2">
                                            <a href="https://wa.me/62{mentee.group_assigned.phone == null ? '' : mentee.group_assigned.phone.slice(1)}" target="_blank" class="btn btn-whatsapp text-nowrap form-control">
                                                <span class="tf-icons bx bxl-whatsapp"></span>&nbsp; Whatsapp
                                            </a>
                                            <a href="mailto:{mentee.group_assigned.email}" target="_blank" class="btn btn-email text-nowrap form-control">
                                                <span class="tf-icons bx bx-envelope"></span>&nbsp; Email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                {#if mentee.program_assigned != 'Not Assign Yet!'}
                <div class="row">
                    <div class="col-md-7">
                        <div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Activities Data</h5>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th class="text-center">No</th>
											<th>Activity Name</th>
											<th>Date</th>
											<th class="text-center">Absence</th>
                                            <th>Information</th>
										</tr>
									</thead>
									<tbody>
                                    {#each mentee.absence_data as d, i}
                                    <tr>
                                        <td class="text-center">{i + 1}</td>
                                        <td>{d.name}</td>
                                        <td>{d.date}</td>
                                        <td class="text-center">
                                            <input
                                            class="form-check-input" type="checkbox" id="absence-{d.activity_id}" checked={d.present ? true : false} on:click={() => {
                                                d.present = !d.present

                                                if(d.present){
                                                    document.getElementById(`absence-info-${d.assignment_id}`).disabled = true
                                                    document.getElementById(`absence-info-${d.assignment_id}`).value = ''
                                                    d.information = ''
                                                }else{
                                                    document.getElementById(`absence-info-${d.assignment_id}`).disabled = false
                                                }

                                                absence(mentee.absence_data.map((a) => a = `absence-${a.activity_id}`), d)
                                            }}>
                                        </td>
                                        <td>
                                            <input class="form-control" type="text" id="absence-info-{d.assignment_id}" value="{d.information}"
                                                on:change={(evt) => {
                                                    d.present = false
                                                    d.information = evt.target.value
                                                    absence(mentee.absence_data.map((a) => a = `absence-${a.activity_id}`), d)
                                                }}>
                                        </td>
                                    </tr>
                                    {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">Assignments Data</h5>
                            </div>
                            <div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th class="text-center">No</th>
											<th>Assignment Title</th>
											<th>Deadline</th>
											<th>Score</th>
										</tr>
									</thead>
									<tbody>
                                    {#each mentee.scoring_data as d, i}
                                    <tr>
                                        <td class="text-center">{i + 1}</td>
                                        <td>{d.name}</td>
                                        <td>{d.deadline}</td>
                                        <td style="width: 225px; min-width: 175px;">
                                            <div class="d-flex flex-row gap-2 align-items-center">
                                                <input
                                                class="form-control" type="number" id="score-{d.assignment_id}" value="{d.score}" on:keyup={() => {
                                                    buttonVisibility(d)
                                                }}>
                                                <div class="">
                                                    <button class="btn btn-sm btn-outline-primary form-control invisible" id="save-{d.assignment_id}" on:click={() => {
                                                        let score = jquery(`#score-${d.assignment_id}`).val() == "" ? 0 : jquery(`#score-${d.assignment_id}`).val()
                                                        d.score = parseFloat(score)
                                                        submitScore(d)
                                                    }}>Save</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/if}
                {/if}
            </div>
        </div>
        <Footer/>
    </div>
</div>