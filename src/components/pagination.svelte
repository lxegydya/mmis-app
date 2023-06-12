<script type="text/javascript">
// @ts-nocheck

	import { fly, scale } from 'svelte/transition';

	export let currentPage
	export let dataList
    export let showRowData
    export let position
</script>

{#if dataList.length > showRowData}
<nav aria-label="Page navigation" class="mt-3">
    <ul class="pagination justify-content-{position}">
        {#if currentPage >= 3}
        <li class="page-item prev">
            <button class="page-link" on:click={() => {
                currentPage = 1
            }}><i class="tf-icon bx bx-chevrons-left"></i></button>
        </li>
        {/if}

        {#if currentPage >= Math.ceil(dataList.length / showRowData) && currentPage != 2}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage - 2
            }}>{currentPage-2}</button>
        </li>
        {/if}

        {#if currentPage > 1}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage - 1
            }}>{currentPage-1}</button>
        </li>
        {/if}

        <li class="page-item active">
            <button class="page-link">{currentPage}</button>
        </li>

        {#if currentPage < Math.ceil(dataList.length / showRowData)}
        <li class="page-item">
            <button class="page-link" on:click={() => {
                currentPage = currentPage + 1
            }}>{currentPage+1}</button>
        </li>
        {/if}

        {#if currentPage + 2 <= Math.ceil(dataList.length / showRowData)}
        <li class="page-item next">
            <button class="page-link" on:click={() => {
                currentPage = Math.ceil(dataList.length / showRowData)
            }}><i class="tf-icon bx bx-chevrons-right"></i></button>
        </li>
        {/if}
    </ul>
</nav>
{/if}