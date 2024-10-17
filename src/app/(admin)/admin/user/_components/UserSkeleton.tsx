const Skeleton = () => {
    return (
        <div className="col-span-1 border border-solid bg-[#2b2d42] border-teal-800 rounded p-4 hover:shadow-lg animate-pulse">
            <div className="flex justify-center">
                <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-6 bg-gray-400 rounded my-2 w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-400 rounded w-1/2 mx-auto my-1"></div>
            <div className="flex justify-around mt-4">
                <div className="h-10 bg-gray-500 rounded w-20"></div>
                <div className="h-10 bg-gray-500 rounded w-20"></div>
            </div>
        </div>
    );
};

export default Skeleton;
