const Skeleton = () => {
    return (
        <div className="flex justify-between w-[1000px] h-[100px] my-3 bg-gray-300 animate-pulse">
            <div className="flex flex-col w-[800px]">
                <div className="h-6 bg-gray-400 rounded mb-2"></div>
                <div className="flex space-x-2 text-gray-500">
                    <div className="h-4 bg-gray-400 rounded w-24"></div>
                    <div className="h-4 bg-gray-400 rounded w-16"></div>
                </div>
            </div>
            <div className="flex space-x-2 self-center">
                <div className="h-10 bg-gray-500 rounded w-20"></div>
                <div className="h-10 bg-red-400 rounded w-20"></div>
            </div>
        </div>
    );
};

export default Skeleton;
