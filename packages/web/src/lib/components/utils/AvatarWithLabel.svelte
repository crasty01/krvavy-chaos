<script lang="ts">
	import { Avatar, Label } from 'bits-ui';

	let { src, name }: {
		src: string | null | undefined;
		name: string
	} = $props();
</script>

<div class="user-avatar">
	<Avatar.Root>
		<Avatar.Image {src} alt={name} />
		<Avatar.Fallback>{name.charAt(0)}</Avatar.Fallback>
	</Avatar.Root>
	<Label.Root>{name}</Label.Root>
</div>
	
<style>
	
.user-avatar {
	display: flex;
	align-items: center;
	gap: var(--size-xs);
}
</style>