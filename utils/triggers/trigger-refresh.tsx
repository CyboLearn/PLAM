"use client";

import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
} from "react";

const RefreshTriggerContext = createContext({
	trigger: false,
	triggerRefresh: () => {},
});

export const useRefreshTrigger = () => useContext(RefreshTriggerContext);

export const RefreshTriggerProvider = ({
	children,
}: {
	readonly children: React.ReactNode;
}) => {
	const [trigger, setTrigger] = useState(false);

	const triggerRefresh = useCallback(() => {
		setTrigger((prev) => !prev);
	}, []);

	const value = useMemo(
		() => ({ trigger, triggerRefresh }),
		[trigger, triggerRefresh],
	);

	return (
		<RefreshTriggerContext.Provider value={value}>
			{children}
		</RefreshTriggerContext.Provider>
	);
};
