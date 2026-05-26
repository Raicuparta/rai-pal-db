export function getBepinexConfigContent(isLegacy: boolean) {
	return `[Logging.Console]
Enabled = true${
		isLegacy
			? `

[Preloader.Entrypoint]
Assembly = UnityEngine.dll
Type = MonoBehaviour
Method = .cctor`
			: ""
	}`;
}
