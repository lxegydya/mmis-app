<script>
// @ts-nocheck

    import Sidebar from "../../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../../components/navbar.svelte";
	import Footer from "../../../../../../components/footer.svelte";
	import ApiController from "../../../../../../ApiController";
	import { onDestroy, onMount } from "svelte";
    import jquery from "jquery";
	import toDate from "../../../../../../CustomTime";

	export let data

	let listData = null
	let status = false

	let absenceList = []

	let getListData = () => {
		ApiController({
			method:"POST",
			endpoint:`super-admin/absence/${data.params.slug}`
		}).then(response => {
			listData = response.data.data
			console.log(listData)
			status = true
		})
	}

	let absence = () => {
		ApiController({
			method:"POST",
			endpoint:'absence/input',
			datas:{
				activity_id:data.params.slug,
				absence_list:absenceList
			}
		}).then(response => {
			if(response.data.msg = 'success'){
				alert('Saved!')
				absenceList = []
				listData.groups.forEach(g => {
					jquery(`#all-present-${g.id}`).html('All Present')
				});
				getListData()
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
	<Sidebar activePage="absence" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
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
							on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Absences / Fill Absences /</span
						> {status ? listData.activity.name + ' (' + toDate(listData.activity.date) + ')' : ''}
					</h4>
					{#if absenceList.length > 0}
					<div>
						<button class="btn btn-primary" on:click={() => {absence()}}>Save Changes</button>
					</div>
					{/if}
				</div>
				{#if status}
				<div class="row mb-3">
				{#each listData.groups as g}
                    <div class="col-lg-6 col-md-12 mb-4">
						<div class="card h-100">
                            <div class="d-flex align-items-center justify-content-between">
								<div class="card-header">
									<h5 class="mb-0">{g.name}</h5>
									<p class="mb-0">Mentor: {g.fullname}</p>
								</div>
								<div class="card-header d-flex flex-row align-items-center gap-2">
									<p class="mb-0 text-center">{g.mentees.filter(m => m.present).length}/{g.mentees.length}</p>
									<button id="all-present-{g.id}" class="btn btn-sm btn-outline-primary" on:click={() => {
										if(jquery(`#all-present-${g.id}`).html() == "All Present"){
											for(let i=0; i<g.mentees.length; i++){
												if(!g.mentees[i].present){
													jquery(`#${g.mentees[i].id}`).click()
												}
											}

											jquery(`#all-present-${g.id}`).html('Undo Changes')
										}else{
											for(let i=0; i<g.mentees.length; i++){
												if(absenceList.filter(ab => ab.id == g.mentees[i].id).length > 0){
													let target = absenceList.findIndex(ab => ab.id == g.mentees[i].id)
													jquery(`#${absenceList[target].id}`).click()
												}
											}

											jquery(`#all-present-${g.id}`).html('All Present')
										}
									}}>All Present</button>
								</div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th class="text-center">NO.</th>
											<th>Mentee's Name</th>
											<th class="text-center">Status</th>
											<th class="text-center">Present</th>
										</tr>
									</thead>
									<tbody>
										{#each g.mentees.sort((a, b) => a.name < b.name ? -1 : 1) as m, i}
										<tr>
											<td class="text-center">{i+1}</td>
											<td>{m.name}</td>
											<td class="text-center {m.status == 'Active' ? 'text-success' : 'text-danger'}">{m.status}</td>
											<td class="text-center">
												<input class="form-check-input" type="checkbox" id="{m.id}" checked={m.present ? true : false} on:click={() => {
													m.present = jquery(`#${m.id}`).is(':checked')

													if(!absenceList.includes(m)){
														absenceList.push(m);
													}else{
														let indexTarget = absenceList.findIndex(ab => {
															return ab.id == m.id
														})

														absenceList[indexTarget].present = m.present
													}

													console.log(absenceList)

													// jquery(`#${m.id}`).attr("disabled", true)
													// absence(m)
												}}>
											</td>
										</tr>
										{/each}
									</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
				{/each}
                </div>
				{/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>