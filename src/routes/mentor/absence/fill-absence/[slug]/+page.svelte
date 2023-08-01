<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../components/navbar.svelte";
	import Pagination from "../../../../../components/pagination.svelte";
	import Footer from "../../../../../components/footer.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";
	import toDate from "../../../../../CustomTime";
	import pagination from "../../../../../CustomPagination";
	import returnNada from "../../../../../CustomReturnNada";
	import Cookie from 'js-cookie'

	export let data

	let activitiesReal = null
	let activities = null
	let activityType = []
	let status = false

	let program = null

	let currentPage = 1
	let showRowData = 10

	let getActivities = (mentor_id) => {
		ApiController({
			method:"POST",
			endpoint:'absence/mentor/activities',
			datas:{
				id:data.params.slug,
				mentor_id:mentor_id
			}
		}).then(response => {
			program = response.data.program
			activitiesReal = response.data.data
			activitiesReal = activitiesReal.sort((a,b) => new Date(a.date) - new Date(b.date))
			activitiesReal.forEach((element, i) => {
				if(!activityType.includes(element.type)){
					activityType.push(element.type)
				}
				element.numbering = i+1
			})

			activities = activitiesReal

			status = true
		})
	}

	let filterActivities = () => {
		currentPage = 1
		activities = activitiesReal
		let tempActivities = activities
		let targetName = jquery('#filter-name').val().toLowerCase()
		let targetType = jquery('#filter-type').val().toLowerCase()

		tempActivities = tempActivities.filter(temp => {
			return temp.name.toLowerCase().includes(targetName) &&
				temp.type.toLowerCase().includes(targetType)
		})

		tempActivities.forEach((temp, i) => {
			temp.numbering = i+1
		})

		activities = tempActivities
	}

    onMount(async () => {
		let mentor_id = Cookie.get('token')
        getActivities(mentor_id)
    })
</script>

<svelte:head>
	<title>Absences | Fill Absences</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="absence" role='mentor'/>
	<div class="w-100 d-flex flex-column">
		<Navbar role='mentor'/>
		<div class="wrapper">
			<div class="container-xxl flex-grow-1 container-p-y">
				<h4 class="fw-bold py-3 mb-4">
					<!-- svelte-ignore a11y-mouse-events-have-key-events -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<span
						id="nav-back-link"
						class="text-muted fw-light"
						on:click={() => {
							window.history.back();
						}}
						on:mouseover={() => jquery('#nav-back-link').css('cursor', 'pointer')}>Absences /</span
					> {status ? `[${program.batch_name}] ${program.program_name}` : ''}
				</h4>
				{#if status}
				<div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">List of Activities</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Activity Name" on:keyup={() => {
											filterActivities()
										}}>
                                    </div>
									<div class="input-group">
                                        <select id="filter-type" class="form-select" on:change={() => {
											filterActivities()
										}}>
                                            <option value="" selected>All Activity Type</option>
											{#each activityType as t}
                                            <option value="{t}" >{t}</option>
											{/each}
                                        </select>
                                    </div>
                                </div>
                            </div>
							<div class="table-responsive text-nowrap">
								<table class="table table-hover">
									<thead>
										<tr class="text-nowrap">
											<th>NO.</th>
											<th>Activity Name</th>
											<th>Program</th>
											<th>Date</th>
											<th class="text-center">Mentees Present</th>
                                            <th>Type of Activity</th>
											<th class="text-center">Action</th>
										</tr>
									</thead>
                                    <tbody>
										{#if pagination(activities, currentPage, showRowData).length == 0}
										{returnNada(currentPage = currentPage-1)}
										{/if}
                                        {#each pagination(activities, currentPage, showRowData) as a, i}
                                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                        <tr id="data-{a.id}" 
											on:mouseover={() => jquery(`#data-${a.id}`).css('cursor', 'pointer')}>
                                            <td>{(showRowData*(currentPage-1)) + i+1}</td>
                                            <td>{a.name}</td>
                                            <td>{a.program_name}</td>
                                            <td>{toDate(a.date)}</td>
											<td class="text-center">{a.mentees_count < 10 ? '0' + a.mentees_count : a.mentees_count} / {a.mentees_total}</td>
                                            <td>{a.type}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-outline-primary" on:click={() => {
													window.location.href = `/mentor/absence/fill-absence/list/${a.id}`
												}}>Fill Up</button>
                                            </td>
                                        </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
					<Pagination bind:currentPage={currentPage} bind:dataList={activities} showRowData={showRowData}/>
                </div>
				{/if}
			</div>
		</div>
		<Footer/>
	</div>
</div>