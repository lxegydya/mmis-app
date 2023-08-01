<script>
// @ts-nocheck

    import Sidebar from "../../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../../components/navbar.svelte";
	import Footer from "../../../../../../components/footer.svelte";
	import Pagination from "../../../../../../components/pagination.svelte";
	import ApiController from "../../../../../../ApiController";
	import { onDestroy, onMount } from "svelte";
    import jquery from "jquery";
	import toDate from "../../../../../../CustomTime";
	import pagination from "../../../../../../CustomPagination";
	import returnNada from "../../../../../../CustomReturnNada";
	import Cookie from 'js-cookie'

	export let data

	let listData = null
	let menteesReal = null
	let mentees = null
	let status = false

	let scoreList = []

	let currentPage = 1
	let showRowData = 10

	let getListData = () => {
		ApiController({
			method:"POST",
			endpoint:`scoring/mentor/get/${data.params.slug}`,
			datas:{
				mentor_id : Cookie.get('token')
			}
		}).then(response => {
			listData = response.data.data
			menteesReal = listData.mentees.sort((a, b) => a.name < b.name ? -1 : 1)
			mentees = menteesReal

			status = true
		})
	}

	let buttonVisibility = (m) => {
		let currentScore = jquery(`#score-${m.id}`).val() == "" ? 0 : jquery(`#score-${m.id}`).val()
		let dbScore = m.score == null ? 0 : m.score

		if(currentScore != dbScore){
			jquery(`#save-${m.id}`).removeClass('invisible')
		}else{
			jquery(`#save-${m.id}`).addClass('invisible')
		}
	}

	let submitScore = (m) => {
		let assignment_id = listData.assignment.id
		ApiController({
			method:"POST",
			endpoint:'scoring/appraise',
			datas:{
				scoring_id : m.scoring_id,
				assignment_id : assignment_id,
				mentee_id : m.id,
				score : m.score
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
				getListData()
				buttonVisibility(m)
			}
		})
	}

    onMount(async () => {
        getListData()
    })
</script>

<svelte:head>
	<title>Absences | Absences List</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="scoring" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<div class="d-flex flex-row justify-content-between">
					<h4 class="fw-bold py-3 mb-4">
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span
							id="nav-back-link"
							class="text-muted fw-light"
							on:click={() => {
								window.history.back();
							}}
							on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Scorings {status ? `/ [${listData.program.batch_name}] ${listData.program.program_name} /` : ''}</span
						> {status && listData.program.batch_name ? 'Appraise' : ''}
					</h4>
				</div>
				{#if status}
				<div class="row mb-3">
					<div class="col-md-12 col-lg-6 mb-3">
						<div class="card">
						  	<div class="d-flex flex-row justify-content-between">
								<h5 class="card-header pb-0">{listData.assignment.name}</h5>
								<div class="card-header pb-0">
									<span class="badge rounded-pill bg-label-info px-3 py-2">{listData.assignment.type}</span>
								</div>
							</div>
						  	<div class="card-body pt-0">
								<blockquote class="blockquote mb-0">
							  		<p>{listData.assignment.description}</p>
							  		<footer class="blockquote-footer">
										Deadline:  
										<cite title="Source Title">{toDate(listData.assignment.deadline)}</cite>
							  		</footer>
								</blockquote>
						  	</div>
						</div>
					</div>
				</div>
				<div class="row mb-3">
                    <div class="col-lg-12 col-md-12">
						<div class="card h-100">
                            <div class="card-header">
								<h5 class="mb-0">Mentees Assignment</h5>
							</div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th class="text-center">NO.</th>
											<th>Mentee's Name</th>
											<th>Major</th>
											<th class="text-center">Status</th>
											<th class="">Mentor</th>
											<th>Score</th>
										</tr>
									</thead>
									<tbody>
										{#if pagination(mentees, currentPage, showRowData).length == 0}
										{returnNada(currentPage = currentPage-1)}
										{/if}
										{#each pagination(mentees, currentPage, showRowData) as m, i}
										<!-- svelte-ignore a11y-mouse-events-have-key-events -->
										<tr id="data-{m.id}" on:mouseover={() => jquery(`#data-${m.id}`).css('cursor', 'pointer')}>
											<td class="text-center" style="width: 50px; min-width: 35px;">{(showRowData*(currentPage-1)) + i+1}</td>
											<td>{m.name}</td>
											<td>{m.major}</td>
											<td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
											<td>[{m.group_name} {m.fullname}]</td>
											<td style="width: 225px; min-width: 175px;">
												<div class="d-flex flex-row gap-2 align-items-center">
													<input class="form-control" type="number" id="score-{m.id}" value="{m.score}" on:keyup={() => {
														buttonVisibility(m)
													}}>
													<div class="">
														<button class="btn btn-sm btn-outline-primary form-control invisible" id="save-{m.id}" on:click={() => {
															let score = jquery(`#score-${m.id}`).val() == "" ? 0 : jquery(`#score-${m.id}`).val()
															m.score = parseFloat(score)
															submitScore(m)
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
					<Pagination bind:currentPage={currentPage} bind:dataList={mentees} showRowData={showRowData}/>
                </div>
				{/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>