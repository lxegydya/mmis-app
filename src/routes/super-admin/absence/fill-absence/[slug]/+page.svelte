<script>
// @ts-nocheck

    import Sidebar from "../../../../../components/sidebar.svelte";
	import Navbar from "../../../../../components/navbar.svelte";
	import ApiController from "../../../../../ApiController";
	import { onMount } from "svelte";
    import jquery from "jquery";
	import toDate from "../../../../../CustomTime";

	export let data

	let activities = null
	let status = false

	let getActivities = () => {
		ApiController({
			method:"POST",
			endpoint:'super-admin/absence/activities',
			datas:{id:data.params.slug}
		}).then(response => {
			activities = response.data.data
			status = true
		})
	}

    onMount(async () => {
        getActivities()
    })
</script>

<svelte:head>
	<title>Absences | Fill Absences</title>
	<html lang="en" />
</svelte:head>

<div class="d-flex h-100">
	<Sidebar activePage="absence" />
	<div class="w-100 d-flex flex-column">
		<Navbar />
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
					> Fill Absences
				</h4>
				{#if status}
				<div class="row">
                    <div class="col-12">
						<div class="card">
                            <div class="d-flex align-items-center justify-content-between">
                                <h5 class="card-header">List of Activities</h5>
                                <div class="card-header d-flex flex-row align-items-center gap-3">
                                    <div class="input-group input-group-merge">
                                        <input type="text" class="form-control" id="filter-name" placeholder="Activity Name">
                                    </div>
									<div class="input-group">
                                        <select id="filter-category" class="form-select">
                                            <option value="" selected>All Activity Type</option>
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
                                        {#each activities.sort((a,b) => new Date(a.date) - new Date(b.date)) as a, i}
                                        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                        <tr id="data-{a.id}" 
											on:click={() => window.location.href = `/super-admin/absence/fill-absence/list/${a.id}`}
											on:mouseover={() => jquery(`#data-${a.id}`).css('cursor', 'pointer')}>
                                            <td>{i+1}</td>
                                            <td>{a.name}</td>
                                            <td>{a.program_name}</td>
                                            <td>{toDate(a.date)}</td>
											<td class="text-center">{a.mentees_count < 10 ? '0' + a.mentees_count : a.mentees_count} / {a.mentees_total}</td>
                                            <td>{a.type}</td>
                                            <td class="text-center">
                                                <button class="btn btn-sm btn-primary">Fill Up</button>
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
			</div>
		</div>
	</div>
</div>